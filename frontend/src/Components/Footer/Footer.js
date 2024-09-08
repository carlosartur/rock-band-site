import { Typography } from "@material-tailwind/react";
import { getAllConfigurations } from "../../Utils/Utils";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faInstagram, faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const currentYear = new Date().getFullYear();

const Footer = ({}) => {

  const [configurations, setConfigurations] = useState({});
  const [links, setLinks] = useState([]);

  useEffect(() => {
    getAllConfigurations()
      .then(data => {
        setConfigurations(data || false);
      })
      .catch(err => console.error(err))
  }, []);

  useEffect(() => {
    const socialLinks = [
      "link-canal-youtube",
      "link-perfil-instagram",
      "link-perfil-facebook",
      "link-perfil-github",
    ];

    const iconsMap = {
      "link-canal-youtube": faYoutube,
      "link-perfil-instagram": faInstagram,
      "link-perfil-facebook": faFacebook,
      "link-perfil-github": faGithub,
    };

    const filteredLinks = socialLinks
      .filter(slug => configurations[slug]?.value)
      .map(slug => ({
        "icon": iconsMap[slug],
        "url": configurations[slug].value,
      }));

    setLinks(filteredLinks);
  }, [configurations]);
  
  return (
    <footer className="relative w-full text-white">
      <div className="mx-auto w-full  px-8">
        <div className="mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Typography
              variant="small"
              className="text-center font-normal text-gray-400 leading-none"
            >
              &copy; {currentYear}{' '}
              <a
                target="_blank"
                className="no-underline text-gray-400"
                href="https://github.com/carlosartur"
              >
                Carlos Gonçalves
              </a>
            </Typography>
          </div>
          <div className="flex items-center gap-4 text-blue-gray-900 sm:justify-center">
            {links.map((link, index) => (
              <Typography
                key={index}
                as="a"
                target="_blank"
                href={link.url}
                className="opacity-80 transition-opacity hover:opacity-100 text-white flex items-center"
              >
                <FontAwesomeIcon icon={link.icon} size="lg" className="align-middle" />
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;