import { useRef } from "react";

export interface IProps {
  acceptedFileTypes?: string;
  label: string;
  onChange: (file: string) => void;
  uploadFileName: string;
}

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  return reader;
}

export const UiFileInputButton: React.FC<IProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const reader = getBase64(event.target.files[0]);

    reader.onload = () => {
      props.onChange(reader.result as string);
    };
  };

  return (
    <>
      <button type="button" onClick={onClickHandler}>
        {props.label}
      </button>
      <input
        accept={props.acceptedFileTypes}
        name={props.uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        style={{ display: "none" }}
        type="file"
      />
    </>
  );
};

UiFileInputButton.defaultProps = {
  acceptedFileTypes: "",
};
