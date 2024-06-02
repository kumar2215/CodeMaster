"use client";
import React from "react";

class createParser {

  blueKeywords: string[];
  purpleKeywords: string[];
  yellowKeywords: string[];
  greenKeywords: string[];
  specialCharacters: string[];
  
  constructor(blueKeywords: string[], purpleKeywords: string[], yellowKeywords: string[], greenKeywords: string[], specialCharacters: string[]) {
    this.blueKeywords = blueKeywords;
    this.purpleKeywords = purpleKeywords;
    this.yellowKeywords = yellowKeywords;
    this.greenKeywords = greenKeywords;
    this.specialCharacters = specialCharacters;
  }

  public parse(code: string) {
    const lines = code.split("\n");
    const brackets = ["(", ")", "{", "}", "[", "]"];
    const specialCharacters = brackets.concat(this.specialCharacters);
    let lastLine = lines.length - 1;
    while (lines[lastLine].trim() === "") lastLine--;

    return (
      <div className="pl-4 text-base" onContextMenu={() => false}>
      {lines.map((line: string, index: number) => {
      let indent = 0;
      if (line === "" && index < lastLine) return <div key={index} className="flex flex-row"><br /></div>;
      line.split("    ").forEach((part: string) => {if (part === "") {indent++;}});
      let newLine = line;
      for (let i = 0; i < specialCharacters.length; i++) {
        newLine = newLine.replaceAll(specialCharacters[i], ` ${specialCharacters[i]} `);
      }
      const tokens = newLine.split(" ");
      return (
        <div key={index} className="flex flex-row">
        { 
          tokens.filter(token => token !== "").length > 0 && tokens.filter(token => token !== "")[0].startsWith("//")
          ? <span className={`text-green-800`} style={{paddingLeft: `${tokens.filter(token => !token).length/2}rem`}}>{line}</span>
          : tokens.map((token: string, index: number) => {
            let color = "text-black";
            if (this.blueKeywords.includes(token)) {color = "text-blue-600";}
            else if (this.purpleKeywords.includes(token)) {color = "text-purple-600";}
            else if (this.greenKeywords.includes(token)) {color = "text-green-600";}
            else if (this.yellowKeywords.includes(token)) {color = "text-yellow-600";}
            else if (brackets.includes(token)) {color = "text-red-600";}
            return (
              <span key={index} className={`${color} 
              ${specialCharacters.includes(token) || specialCharacters.includes(tokens[index+1]) ? "" : "pr-2"}`}>{token}</span>
            );
          })
        }
        </div>);
      })}
      </div>
    );
  }
}

export default createParser;