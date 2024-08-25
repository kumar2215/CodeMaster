"use client";
// @ts-ignore
import html2pdf from "html2pdf.js";
import ReactDOMserver from "react-dom/server";
import parse from "html-react-parser";
import { toast } from "react-toastify";

export default async function downloadResults(data: any, setLoading: any) {
  setLoading(true);
  console.log("Downloading results");

  // console.log(html2pdf);

  const { name, user, links, score } = data;
  const origin = window.location.origin;
  const parser = new DOMParser();

  const elements = await Promise.all(links.map(async (link: string, index: number) => {
    link = origin + link;

    return await fetch(link) 
      .then(async (response) => {
        return await response.text();
      })
      .then((html) => {
        const doc = parser.parseFromString(html, "text/html");
        const ele = doc.getElementById('Question');

        return parse(ele?.innerHTML as string);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.", {autoClose: 3000});
        console.error('Failed to fetch page: ', err);  
      });
  }));

  const elementToDownload = (
    <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div id="content" className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{name} results for {user}</h1>
        <h3 className="text-xl font-semibold">Score: {score}</h3>
        {elements}
      </div>
    </body>
    </html>
  );

  const opt = {
    margin: 0.2,
    filename: `${name} results.pdf`,
    image: { type: 'jpeg', quality: 1.0 },
    pagebreak: { mode: ['avoid-all'] },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(ReactDOMserver.renderToString(elementToDownload)).save();
  setLoading(false);
}