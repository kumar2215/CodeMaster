import { StaticImageData } from "next/image";

export default function topicCard(title: string, link: string, image: StaticImageData) {
    return (
      <a href={link}>
        <div
            style={{
              display: "flex",
              padding: "20px",
              flexDirection: "row",
              justifyContent: "start",
              backgroundColor: "lightgrey",
              border: "1px solid black",
              borderRadius: "10px",
              boxShadow: "3px 3px 2px #888888"
            }}
            className="hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer h-[100px] lg:w-full lg:h-[200px]"
        >
            <img src={image.src} alt="icon"/>
          <h1 className="my-auto ml-5 text-base font-bold lg:text-2xl lg:ml-20">{title}</h1>
        </div>
      </a>
    );
  }