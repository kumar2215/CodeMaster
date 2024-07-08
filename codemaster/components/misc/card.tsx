import { StaticImageData } from "next/image";

export default function section(title: string, description: string, link: string, image: StaticImageData) {
    return (
      <a href={link}>
        <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "20px",
          flexDirection: "column",
          justifyContent: "start",
          backgroundColor: "ghostwhite",
          border: "1px solid black",
          borderRadius: "10px",
          boxShadow: "3px 3px 2px #888888"
        }}
        className="hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer lg:h-full"
        >
          <div className="grid grid-rows-2 gap-x-5 lg:grid-cols-2 lg:grid-rows-1">

              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <br/>
                <img src={image.src} alt="icon"/>
              </div>
              <p className="text-md text-left lg:text-lg">
                {description}
              </p>
            </div>
          </div>
      </a>
    );
  }