import { StaticImageData } from "next/image";

export default function topicCard(title: string, link: string, image: StaticImageData) {
    return (
      <a href={link}>
        <div
            style={{
              width: "100%",
              height: "200px",
              display: "flex",
              padding: "20px",
              flexDirection: "row",
              gap: "40px",
              justifyContent: "start",
              backgroundColor: "lightgrey",
              border: "1px solid black",
              borderRadius: "10px",
              boxShadow: "3px 3px 2px #888888"
              
            }}
            className="hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
            data-testid="topicCard"

        >
          <div style={{width: "19%"}}>
            <img src={image.src} alt="icon"/>
          </div>
          <h1 className="text-2xl font-bold my-auto">{title}</h1>
        </div>
      </a>
    );
  }