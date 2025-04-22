"use client";
import ReactDropzone from "react-dropzone";
import { acceptedFiles, extensions } from "../lib/constants";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Action } from "../lib/types";
import { toast } from "sonner";

import {
  File,
  Upload,
  Loader,
  Download,
  X,
  Check,
  FileWarningIcon,
  Image,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { bytesToSize, compressFileName } from "~/lib/file-conversion";

export function DropArea() {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  const handleUpload = (uploadedFiles: any[]) => {
    setIsHovering(false);
    setFiles(uploadedFiles);

    const temp: Action[] = uploadedFiles.map((file) => ({
      file,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      from: file.name.slice(file.name.lastIndexOf(".") - 1 + 2),
      to: null,
      isConverted: false,
      isConverting: false,
      isError: false,
    }));

    setActions(temp);
  };

  if (actions.length) {
    return (
      <ActionsList
        actions={actions}
        setActions={setActions}
        files={files}
        setFiles={setFiles}
      />
    );
  }

  return (
    <ReactDropzone
      accept={acceptedFiles}
      onDragEnter={() => {
        setIsHovering(true);
        console.log("enter");
      }}
      onDragLeave={() => setIsHovering(false)}
      onDrop={handleUpload}
      onDropRejected={() => {
        setIsHovering(false);
        toast.error("Unknown file type");
      }}
      onError={() => {
        setIsHovering(false);
        toast.error("Error uploading file");
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="flex cursor-pointer items-center justify-center rounded-md border-sky-800 bg-slate-950 text-sky-100 shadow-sm shadow-sky-700"
        >
          <input {...getInputProps()} />
          <div className="grid gap-4 px-16 py-10">
            {isHovering ? (
              <>
                <div className="flex justify-center text-6xl">
                  <Upload size={48} />
                </div>
                <h3 className="text-center text-2xl font-normal">
                  Yes, right there
                </h3>
              </>
            ) : (
              <>
                <div className="flex justify-center text-6xl">
                  <File size={48} />
                </div>
                <h3 className="text-center text-2xl font-normal">
                  Click, or drop your files here
                </h3>
              </>
            )}
          </div>
        </div>
      )}
    </ReactDropzone>
  );
}

function ActionsList({
  actions,
  files,
  setActions,
  setFiles,
}: {
  actions: Action[];
  setActions: Dispatch<SetStateAction<Action[]>>;
  files: any[];
  setFiles: Dispatch<SetStateAction<any[]>>;
}) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("...");

  const ffmpegRef = useRef<any>(null);

  const reset = () => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  };

  const checkIsReady = () => {
    let temp = true;
    actions.forEach((action) => {
      if (!action.to) temp = false;
    });
    setIsReady(temp);
  };

  const updateFile = ({ fileName, to }: { fileName: string; to: string }) => {
    setActions(
      actions.map((action) => {
        if (action.fileName === fileName) {
          return {
            ...action,
            to,
          };
        }

        return action;
      }),
    );
  };

  const deleteFile = ({ action }: { action: Action }) => {
    setActions(actions.filter((elt) => elt !== action));
    setFiles(files.filter((elt) => elt.name !== action.fileName));
  };

  // const load = async () => {
  //     const ffmpeg_response: FFmpeg = await loadFfmpeg();
  //     ffmpegRef.current = ffmpeg_response;
  //     setIsLoaded(true);
  //   };

  const download = (action: Action) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    for (let action of actions) {
      !action.isError && download(action);
    }
  };

  useEffect(() => {
    if (actions.length) {
      checkIsReady();
      return;
    }

    setIsDone(false);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  }, [actions]);

  // useEffect(() => {
  //   load();
  // }, []);

  return (
    <div className="flex flex-col gap-6">
      {actions.map((action, i) => (
        <div
          key={i}
          className="relative flex h-fit w-full cursor-pointer flex-wrap items-center justify-between space-y-2 rounded-xl border px-4 py-4 lg:h-20 lg:flex-nowrap lg:px-10 lg:py-0"
        >
          {!isLoaded && (
            <Skeleton className="absolute -ml-10 h-full w-full cursor-progress rounded-xl" />
          )}
          <div className="flex items-center gap-4">
            <span className="text-2xl text-sky-400">
              <Image />
            </span>
            <div className="flex w-96 items-center gap-1">
              <span className="text-md overflow-x-hidden font-medium">
                {compressFileName(action.fileName)}
              </span>
              <span className="text-muted-foreground text-sm">
                ({bytesToSize(action.fileSize)})
              </span>
            </div>
          </div>

          {action.isError ? (
            <Badge variant="destructive" className="flex gap-2">
              <span>Error Converting File</span>
              <FileWarningIcon />
            </Badge>
          ) : action.isConverted ? (
            <Badge variant="default" className="flex gap-2 bg-green-500">
              <span>Done</span>
              <Check />
            </Badge>
          ) : action.isConverting ? (
            <Badge variant="default" className="flex gap-2">
              <span>Converting</span>
              <span className="animate-spin">
                <Loader />
              </span>
            </Badge>
          ) : (
            <div className="text-muted-foreground text-md flex items-center gap-4">
              <span>Convert to</span>
              <Select
                onValueChange={(value) => {
                  setSelected(value);
                  updateFile({ fileName: action.fileName, to: value });
                }}
                value={selected}
              >
                <SelectTrigger className="text-muted-foreground bg-background text-md w-32 text-center font-medium outline-none focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent className="h-fit">
                  {action.fileType.includes("image") && (
                    <div className="grid w-fit grid-cols-2 gap-2">
                      {extensions.image.map((elt, i) => (
                        <div key={i} className="col-span-1 text-center">
                          <SelectItem value={elt} className="mx-auto">
                            {elt}
                          </SelectItem>
                        </div>
                      ))}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {action.isConverted ? (
            <Button variant="outline" onClick={() => download(action)}>
              Download
            </Button>
          ) : (
            <span
              onClick={() => deleteFile({ action })}
              className="hover:bg-muted text-foreground flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl"
            >
              <X />
            </span>
          )}
        </div>
      ))}
      <div className="flex w-full justify-end">
        {isDone ? (
          <div className="w-fit space-y-4">
            <Button
              size="lg"
              className="text-md relative flex w-full items-center gap-2 rounded-xl py-4 font-semibold"
              onClick={downloadAll}
            >
              {actions.length > 1 ? "Download All" : "Download"}
              <Download />
            </Button>
            <Button
              size="lg"
              onClick={reset}
              variant="outline"
              className="rounded-xl"
            >
              Convert Another File(s)
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            disabled={!isReady || isConverting}
            className="text-md relative flex w-44 items-center rounded-xl py-4 font-semibold"
            // onClick={convert}
          >
            {isConverting ? (
              <span className="animate-spin text-lg">
                <Loader />
              </span>
            ) : (
              <span>Convert Now</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
