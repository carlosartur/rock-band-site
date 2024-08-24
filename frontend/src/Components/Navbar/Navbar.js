import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import InternalAnchor from "../Anchor/InternalAnchor";
 
export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);
 
  const links = [
    {
      href: 'who-we-are',
      text: 'Quem somos'
    },
    {
      href: '#',
      text: 'Próximos shows'
    }
  ];

  const navList = (
    <ul 
      className="mt-2 mt-auto flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6"
    >
      {links.map((item, idx) => {
        return <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal font-bold"
          key={idx}
        >
          
          <InternalAnchor 
            to={item.href} 
            className="flex items-center !no-underline text-black" 
            text={item.text}
            redirectTo={"/"}
          />

        </Typography>
      })}
    </ul>
  );
 
  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium !no-underline font-bold"
        >
          Clan de Kali
        </Typography>
        <div className="mr-4 hidden lg:block">{navList}</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-x-1">
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
            >
              <span>Contato</span>
            </Button>
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>

      <Collapse open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <Button fullWidth variant="gradient" size="sm" className="">
            <span>Contato</span>
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
}