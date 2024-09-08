import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
    Typography,
    Avatar,
  } from "@material-tailwind/react";
import Debug from "../Debug/Debug";
import { BrazilianFormatData } from "../../admin/components/BrazilianFormatData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
   
export function NextShows({events}) {

  const [lightBoxOpen, setLightBoxOpen] = useState(false);

  const [lightboxSlides, setLightboxSlides] = useState([]);

  const reorderLightboxSlides = (imgSrc) => {
    const clickedSlideIndex = lightboxSlides.findIndex(
      (slide) => slide.src === imgSrc
    );

    if (clickedSlideIndex !== -1) {
      const reorderedSlides = [
        lightboxSlides[clickedSlideIndex],
        ...lightboxSlides.slice(0, clickedSlideIndex),
        ...lightboxSlides.slice(clickedSlideIndex + 1)
      ];

      setLightboxSlides(reorderedSlides);

      console.log(reorderedSlides)
    }

    setLightBoxOpen(true);
  };

  return (
    <div className="w-[32rem]">
      <Timeline>
        {events.length && events.map((eventData, idx) => {
          const isLast = idx === (events.length - 1);
          const imgSrc = eventData.gallery_id ? `${process.env.REACT_APP_API_URL}/storage/${eventData.banner.path}` : false;

          const city = eventData.city ? `, ${eventData.city.name} - ${eventData.city.state.acronym}` : ''

          if (eventData.gallery_id) {
            const slideExists = lightboxSlides.find(
              (slide) => 
                slide.src === imgSrc
            );

            if (!slideExists) {
              lightboxSlides.push({
                src: imgSrc,
                alt: eventData.name,
              });
            }
          }

          return <TimelineItem key={idx}>
            {!isLast ? <TimelineConnector /> : null}
            <TimelineHeader>
              { eventData.gallery_id 
                ? <TimelineIcon
                    className="p-0"
                    onClick={() => {
                      reorderLightboxSlides(imgSrc);
                    }}
                  >
                    <Avatar size="sm" src={imgSrc} alt={ eventData.name } withBorder />
                  </TimelineIcon>
                : <TimelineIcon className="p-2">
                    <MusicalNoteIcon className="h-4 w-4" />
                  </TimelineIcon>
              }

              <Typography variant="h5" className="text-gray-200 cursor-pointer"
                onClick={() => {
                  if (!imgSrc) {
                    return null;
                  }
                  reorderLightboxSlides(imgSrc);
                }}
              >
                { eventData.name + (eventData.organizer ? `` : ``)} - <BrazilianFormatData date={eventData.date_start}/>
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8">
              <Typography
                onClick={() => {
                  if (!imgSrc) {
                    return null;
                  }
                  reorderLightboxSlides(imgSrc);
                }}
                color="gary" 
                className="font-normal text-gray-500" 
                dangerouslySetInnerHTML={{__html: eventData.description}} 
              />

              <Typography color="gary" className="font-normal text-gray-400">
                <a className="font-normal text-gray-400 no-underline" target="_blank" href={`https://maps.google.com/?q=${eventData.address}${city}`}>
                  <p>
                    <FontAwesomeIcon icon={faLocationDot} /> &nbsp;
                    <span>{eventData.address}</span>
                    <span>{city}</span>
                  </p>
                </a>
              </Typography>
            </TimelineBody>
          </TimelineItem>
        })}
      </Timeline>

      {lightBoxOpen && (
        <Lightbox
          open={lightBoxOpen}
          close={() => setLightBoxOpen(false)}
          slides={lightboxSlides}
        />
      )}
    </div>
  );
}