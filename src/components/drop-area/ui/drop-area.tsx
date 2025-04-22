"use client";
import ReactDropzone from "react-dropzone";
import { acceptedFiles } from "../lib/constants";
import { useRef, useState } from "react";
import type { Action } from "../lib/types";
import { toast } from "sonner";

export function DropArea() {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<string>("video");
  const [selected, setSelected] = useState<string>("...");

  const ffmpegRef = useRef<any>(null);

  const handleEnter = () => {};

  const handleExit = () => {};

  const handleUpload = () => {};

  return (
    <ReactDropzone
      accept={acceptedFiles}
      onDragEnter={handleEnter}
      onDragLeave={handleExit}
      onDrop={handleUpload}
      onDropRejected={() => {}}
      onError={() => {
        handleExit();
        toast.error("Error uploading file");
      }}
    ></ReactDropzone>
  );
}
