import "./App.css";
import { Carousel, CarouselItem } from "./components/carousel";
const data = [
  {
    id: 1,
    title: "Slide 1",
    image: "https://picsum.photos/id/1014/600/300",
    landing_page: "https://landingpage1",
  },
  {
    id: 2,
    title: "Slide 2",
    image: "https://picsum.photos/id/1016/600/300",
    landing_page: "https://landingpage2",
  },
  {
    id: 3,
    title: "Slide 3",
    image: "https://picsum.photos/id/1018/600/300",
    landing_page: "https://landingpage3",
  },
  {
    id: 4,
    title: "Slide 4",
    image: "https://picsum.photos/id/1020/600/300",
    landing_page: "https://landingpage4",
  },
  {
    id: 5,
    title: "Slide 5",
    image: "https://picsum.photos/id/1022/600/300",
    landing_page: "https://landingpage5",
  },
  {
    id: 6,
    title: "Slide 6",
    image: "https://picsum.photos/id/1024/600/300",
    landing_page: "https://landingpage6",
  },
];
function App() {
  return (
    <Carousel>
      {data.map((item) => {
        return (
          <CarouselItem
            key={item.id}
            onClick={() => {
              window.open(item.landing_page, "_blank", "noopener,noreferrer");
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              draggable={false}
              style={{
                display: "block",
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </CarouselItem>
        );
      })}
    </Carousel>
  );
}

export default App;
