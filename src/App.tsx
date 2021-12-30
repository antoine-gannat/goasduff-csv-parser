import React from "react";

import { useStyles } from "./App.style";
import { parseFile } from "./parser";

function createFileToDownload(content: string) {
  const filename = "goasduff-sms.csv";
  const a = document.createElement("a");
  const blob = new Blob([content]);
  const url = URL.createObjectURL(blob);
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  a.click();
}

export default function App(): JSX.Element {
  const [file, setFile] = React.useState<File | null>(null);
  const [parsedFile, setParsedFile] = React.useState<string | null>(null);
  const onFileChange = React.useCallback((ev) => {
    const file = ev.target.files[0];
    setFile(file);
    parseFile(file).then(setParsedFile);
  }, []);
  const styles = useStyles();
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Goasduff CSV parser</h1>
      <label htmlFor="file-input">
        <div id="file-selector" className={styles.fileUploadZone}>
          {file ? file.name : "Click or Drop files here.."}
        </div>
      </label>
      {/* The input is hidden so that we can style something better above */}
      <input
        hidden
        id="file-input"
        type="file"
        onChange={onFileChange}
        className={styles.input}
      />
      {parsedFile && (
        <>
          <textarea
            className={styles.resultArea}
            defaultValue={parsedFile}
          ></textarea>
          <button
            className={styles.copyAllBtn}
            onClick={() => navigator.clipboard.writeText(parsedFile)}
          >
            Copy all
          </button>
          <button
            className={styles.copyAllBtn}
            onClick={() => createFileToDownload(parsedFile)}
          >
            Download
          </button>
        </>
      )}
    </main>
  );
}
