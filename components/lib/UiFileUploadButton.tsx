"use client";

import { useRef, useState } from "react";
import { buttonClasses } from "../ui";

export interface IProps {
  acceptedFileTypes?: string;
  label: string;
  onChange: (file: string) => void;
  uploadFileName: string;
}

function getBase64(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return reader;
}

export const UiFileInputButton: React.FC<IProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = getBase64(file);

    reader.onload = () => {
      setFileName(file.name);
      props.onChange(reader.result as string);
    };
  };

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={buttonClasses("default", "h-9 text-sm")}
      >
        {props.label}
      </button>
      {fileName ? (
        <span className="min-w-0 truncate text-sm text-gray-600">
          Valgt: <span className="font-medium text-ink">{fileName}</span>
        </span>
      ) : null}
      <input
        accept={props.acceptedFileTypes ?? ""}
        name={props.uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        className="hidden"
        type="file"
      />
    </div>
  );
};
