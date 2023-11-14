import { Socket } from "socket.io-client";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import Quill, { TextChangeHandler } from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import classes from "./CollaborationPage.module.css";
import prettier from "prettier/standalone";
import BabelPlugin from "prettier/plugins/babel";
import JsPlugin from "prettier/plugins/estree";
import TsPlugin from "prettier/plugins/typescript";
import estree from "prettier/plugins/estree";
import { Button } from "@mui/material";
import useJudge0 from "../../hooks/useJudge0";
import SaveCodeDialog from "./SaveCodeDialog";
import { useAppDispatch } from "../../store/hook";
import { setIsDirtyEditor } from "../../store/slices/isDirtyEditorSlice";

interface EditorProps {
  socket: Socket | undefined;
  setStdout: React.Dispatch<React.SetStateAction<string>>;
  setIsOutputLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const PROGRAMMING_LANGUAGES = [
  "bash",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "go",
  "java",
  "javascript",
  "kotlin",
  "lua",
  "perl",
  "objectivec",
  "php",
  "plaintext",
  "python",
  "r",
  "rust",
  "swift",
  "typescript",
  "vbnet",
];

const themeNames = ["atom-one-dark", "github-dark", "monokai", "dark"] as const;

type ThemeNames = (typeof themeNames)[number];

const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  ["code-block"],
  ["clean"],
];

function Editor({ socket, setStdout, setIsOutputLoading }: EditorProps) {
  const dispatch = useAppDispatch();
  const [quill, setQuill] = useState<Quill | null>(null);
  const [programmingLanguage, setProgrammingLanguage] = useState("javascript");
  const [theme, setTheme] = useState<ThemeNames>("atom-one-dark");
  const { sendSubmission, checkLanguage } = useJudge0();

  useEffect(() => {
    const editor = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        syntax: {
          highlight: (text: string) => {
            return hljs.highlight(text, { language: programmingLanguage })
              .value;
          },
        },
      },
      placeholder: "Write your code here...",
      scrollingContainer: "#scrolling-container",
    });

    setQuill(editor);

    const editorTextLength = editor.getLength();
    const currentFormat = editor.getFormat(0, editorTextLength);

    if (currentFormat?.["code-block"] !== true) {
      console.log("auto formatting as code-block...");
      editor.formatLine(0, editorTextLength, { "code-block": true });
    }

    editor.focus();

    // cleanup
    return () => {
      setQuill(null);

      const quillToolbarElements = document
        .getElementById("scrolling-container")
        ?.getElementsByClassName("ql-toolbar ql-snow");

      if (quillToolbarElements === undefined) {
        return;
      }

      // remove leftover HTML elements from the previous Quill.js editor
      for (const el of quillToolbarElements) {
        el.remove();
      }
    };
  }, [programmingLanguage]);

  useEffect(() => {
    if (socket === undefined || quill === null) {
      return;
    }

    socket.on("room count", (count) => {
      if (count === 2) {
        quill.enable();
      } else {
        quill.disable();
      }
    });

    socket.on("request code", (id) => {
      socket.emit("send code", id, quill.getContents());
    });

    socket.on("receive code", (delta) => {
      quill.setContents(delta);
    });

    socket.on("request language", (id) => {
      socket.emit("send language", id, programmingLanguage);
    });

    socket.on("receive language", (programmingLanguage) => {
      setProgrammingLanguage(programmingLanguage);
    });

    const textChangeHandler: TextChangeHandler = (
      delta,
      _oldContents,
      source
    ) => {
      dispatch(setIsDirtyEditor(true));

      if (source === "user") {
        // quill.formatText(0, quill.getLength(), { "code-block": true });
        socket.emit("client code changes", delta);
      }
    };

    quill.on("text-change", textChangeHandler);

    socket.on("server code changes", (delta) => {
      quill.off("text-change", textChangeHandler);
      quill.updateContents(delta);
      quill.on("text-change", textChangeHandler);
    });

    socket.on("server code format", (content) => {
      quill.off("text-change", textChangeHandler);
      quill.setContents(content);
      quill.formatText(0, quill.getLength(), { "code-block": true });
      quill.on("text-change", textChangeHandler);
    });

    socket.on("server change language", (language) => {
      setProgrammingLanguage(language);
    });
  }, [socket, quill, programmingLanguage, dispatch]);

  const handleProgrammingLanguageSelectChange = useCallback(
    (e: SelectChangeEvent) => {
      if (socket === undefined) {
        return;
      }

      setProgrammingLanguage(e.target.value);
      socket.emit("client change language", e.target.value);
    },
    [socket]
  );

  const handleThemeSelectChange = useCallback((e: SelectChangeEvent) => {
    setTheme(e.target.value as ThemeNames);
  }, []);

  const handleCodeExecution = useCallback(() => {
    if (quill === null) {
      return;
    }

    setIsOutputLoading(true);
    sendSubmission(quill.getText(), programmingLanguage).then((res) => {
      if (res === undefined) {
        return;
      }

      setIsOutputLoading(false);
      if (res.stderr !== null) {
        setStdout(res.stderr);
      } else {
        setStdout([res.compile_output, res.stdout].join("\n").trim());
      }
    });
  }, [
    quill,
    programmingLanguage,
    sendSubmission,
    setIsOutputLoading,
    setStdout,
  ]);

  const getFormatted = useCallback((text: string, language: string) => {
    if (language === "javascript") {
      return prettier.format(text, {
        parser: "babel",
        plugins: [BabelPlugin, JsPlugin],
        semi: false,
      });
    }

    if (language === "typescript") {
      return prettier.format(text, {
        parser: "typescript",
        plugins: [TsPlugin, estree],
        semi: false,
      });
    }

    return Promise.resolve(text);
  }, []);

  const handleFormatCode = useCallback(() => {
    if (quill === null || socket === undefined) {
      return;
    }

    getFormatted(quill.getText(), programmingLanguage)
      .then((formattedCode) => {
        quill.setText(formattedCode);
        quill.formatText(0, quill.getLength(), {
          "code-block": true,
        });
        socket.emit("client code format", quill.getContents());
        setStdout("Code formatted successfully!");
      })
      .catch((err) => {
        setStdout(err.message);
      });
  }, [getFormatted, programmingLanguage, quill, socket, setStdout]);

  const getStylesheet = useCallback(() => {
    switch (theme) {
      case "atom-one-dark":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/atom-one-dark.css"
          />
        );
      case "github-dark":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/github-dark.css"
          />
        );
      case "monokai":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/monokai.css"
          />
        );
      case "dark":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/dark.css"
          />
        );
    }
  }, [theme]);

  const getTextFunction = useCallback(() => {
    return quill?.getText();
  }, [quill]);

  return (
    <>
      <Helmet>{getStylesheet()}</Helmet>
      <div id="scrolling-container" className={classes.scrollingContainer}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1rem 0",
          }}
        >
          <SaveCodeDialog
            getTextFunction={getTextFunction}
            programmingLanguage={programmingLanguage}
          />

          <Button
            onClick={handleFormatCode}
            variant="contained"
            style={{ minWidth: "140px" }}
            disabled={
              programmingLanguage !== "javascript" &&
              programmingLanguage !== "typescript"
            }
          >
            Format Code
          </Button>

          <Button
            variant="contained"
            style={{ minWidth: "140px" }}
            onClick={handleCodeExecution}
            disabled={!checkLanguage(programmingLanguage)}
          >
            Run Code
          </Button>

          <FormControl fullWidth>
            <InputLabel id="programming-language-select-label">
              Programming Language
            </InputLabel>
            <Select
              labelId="programming-language-select-label"
              id="programming-language-select"
              value={programmingLanguage}
              label="Programming Language"
              onChange={handleProgrammingLanguageSelectChange}
            >
              {PROGRAMMING_LANGUAGES.map((each) => (
                <MenuItem key={each} value={each}>
                  {each}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="code-editor-theme-select-label">Theme</InputLabel>
            <Select
              labelId="code-editor-theme-select-label"
              id="code-editor-theme-select"
              value={theme}
              label="Theme"
              onChange={handleThemeSelectChange}
            >
              {themeNames.map((each) => (
                <MenuItem key={each} value={each}>
                  {each}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ fontStyle: "italic", marginBottom: "1rem" }}>
          <strong>Note</strong>: code formatting is only available for
          JavaScript and TypeScript
        </div>

        <div id="editor" className={classes.editor} />
      </div>
    </>
  );
}

export default Editor;
