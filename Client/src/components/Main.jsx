import axios from "axios";
import "../App.css";
import stubs from "../stubs";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {

  //configuration for setStuff
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [Language, setLanguage] = useState("cpp");
  const [codeExecId, setCodeId] = useState(null);
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false); // Button disabled status
  const navigate = useNavigate();


  //Verify whether user is authenticated or not
  const getUser = async () => {
    try {
      const url = `http://localhost:5000/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user);
      console.log(data.user);
      if (!data) {
        navigate("/");
      }
    } catch (err) {
      console.log("hello !");
      console.log(err);
      navigate("/");
    }
  };


  //useeffect stuff
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setCode(stubs[Language]);
  }, [Language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-Language") || "cpp";
    setLanguage(defaultLang);
  }, []);




  
  let pollInterval;

  const handleSubmit = async () => {
    if (buttonDisabled) {
      // If button is disabled, prevent submitting
      console.log("Please wait. Button is disabled.");
      return;
    }

    const payload = {
      Language,
      code,
    };

    try {
      setOutput("");
      setStatus(null);
      setCodeId(null);
      setButtonDisabled(true);

      const { data } = await axios.post("http://localhost:5000/code/", payload);

      if (data.submission_id) {

        setCodeId(data.submission_id);
        setStatus("Submitted.");


        //to constantly make request until a verdict is recieved
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/code/status`,
            {
              params: {
                id: data.submission_id,
              },
            }
          );

          console.log(statusRes);
          const { success, status, output } = statusRes;

          if (success) {
            //if pending then retry.
            if (status === "pending") return;
            setStatus(status);
            setOutput(output);
            clearInterval(pollInterval);
            setButtonDisabled(false);
          } else {
            const { error, stderr } = output;
            console.error(stderr);
            setOutput(stderr || "Bad request");
            setStatus("Bad request");
            clearInterval(pollInterval);
            setButtonDisabled(false); 
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
        setButtonDisabled(false);
      }

      
    } catch (error) {
      console.error(error);
      setOutput(
        error.response?.data?.err?.stderr || "Please retry submitting."
      );
      setButtonDisabled(false);
    }
  };

  const setDefaultLanguage = () => {
    localStorage.setItem("default-Language", Language);
    console.log(`${Language} set as default!`);
  };

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <div>
        <label>Language:</label>
        <select
          value={Language}
          onChange={(e) => {
            const shouldSwitch = window.confirm(
              "Are you sure you want to change Language? WARNING: Your current code will be lost."
            );
            if (shouldSwitch) {
              setLanguage(e.target.value);
            }
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br />
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button>
      </div>
      <br />
      <textarea
        rows="20"
        cols="75"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea>
      <br />
      <button onClick={handleSubmit} disabled={buttonDisabled}>
        Submit
      </button>
      {buttonDisabled && <p>Button disabled. Please wait.</p>}
      <p>{status}</p>
      <p>{codeExecId ? `Submission ID: ${codeExecId}` : ""}</p>
      <p>{output}</p>
    </div>
  );
}

export default Main;
