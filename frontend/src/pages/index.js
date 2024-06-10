import Image from "next/image";
import axios from "axios";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { io } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState(undefined);
  const [email, setEmail] = useState("");
  const [buttonText, setButtonText] = useState("Validate");
  const [error, setError] = useState(null);
  const [successful, setSuccessful] = useState([]);
  const [successfulGoodEmail, setSuccessfulGoodEmail] = useState([]);
  const [bad, setBad] = useState([]);
  const [response, setResponse] = useState(null);

  const validateEmail = async (e) => {
    e.preventDefault();
    if (email === "") {
      alert("Email field must no be empty");
      return;
    }

    setButtonText("Checking Validation...");

    const goodEmails = [];
    const copyGoodEmails = [];
    const badEmails = [];

    socket.emit("validate_email", { email }, (res) => {
      if (res) {
        setResponse(res);
        setButtonText("Done...");
        setTimeout(() => {
          setButtonText("Validate");
        }, 4000);
      }

      res.map((data) => {
        if (data.priority <= 5 || data.priority === 0) {
          goodEmails.push(data);
          copyGoodEmails.push(data.email);
          setSuccessful([...successful, ...goodEmails]);
          setSuccessfulGoodEmail([...successfulGoodEmail, ...copyGoodEmails]);
        } else {
          badEmails.push(data);
          setBad([...bad, ...badEmails]);
        }
      });
    });
    //boringcreatives@gmail.com essiensaviour.a@gmail.com messi@turn.com esther@sterlingbank.com esther@firstbank.com justin@codexmedia.com essien@boringcreatives.co admin@setly.ai enoughofme@stylepluss.io frenchkiss@french.io
  };

  const copyBtn = async () => {
    let goodEmails = successfulGoodEmail.join(" ");
    try {
      await navigator.clipboard.writeText(goodEmails);
      alert("Text copied to clipboard!");
    } catch (err) {
      alert("Failed to copy text.");
    }
  };

  const reset = async () => {
    setSuccessful([]);
    setBad([]);
    setEmail("");
  };

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      setSocket(socket);
      console.log(socket.id);
      socket.emit(
        "add_user",
        { email: "admin@gmail.com", id: socket.id },
        (res) => {
          console.log(res);
        }
      );
    });
  }, []);

  return (
    <main className={` min-h-screen py-7 ${inter.className}`}>
      {error && <p className="bg-red-200 py-2 px-2">{error}</p>}
      <div className="relative flex justify-center mb-12">
        <form onSubmit={validateEmail}>
          <div className="mb-1">
            <label htmlFor="email" className="mb-2 flex">
              Enter Email(s) here
            </label>
            <textarea
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 p-3 rounded-md outline-none border-blue-500"
              cols={70}
              rows={10}
            />
          </div>

          <div className="mb-3">
            <small>{email.split(" ").length} Total email</small>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 px-12 py-2 text-white rounded-md text-[13px]"
              >
                {buttonText}
              </button>
              {successful.length > 0 && (
                <button
                  type="button"
                  onClick={copyBtn}
                  className="bg-orange-600 px-12 py-2 text-white rounded-md text-[13px]"
                >
                  Copy
                </button>
              )}
            </div>
            {response && (
              <button
                type="button"
                onClick={reset}
                className="bg-red-600 px-12 py-2 text-white rounded-md text-[13px]"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      <section className="w-full h-full flex gap-5 px-5">
        <div className="w-full h-full">
          <p className="mb-2">{successful.length} Successful Emails</p>
          {successful.map((item, index) => (
            <div
              className="flex justify-between text-[13px] py-1 bg-green-200 px-2 mb-3"
              key={index}
            >
              <span>{item.email}</span>
              <div className="flex gap-3">
                <span>DELIVERABLE</span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full h-full">
          <p className="mb-2">{bad.length} Bad Emails</p>
          {bad.map((item, index) => (
            <div
              className="flex justify-between text-[13px] py-1 bg-red-200 px-2 mb-3"
              key={index}
            >
              <span>{item.email}</span>
              <div className="flex gap-3">
                <span>UNDELIVERABLE</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
