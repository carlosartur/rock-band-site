import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import Recaptcha from "../Recaptcha";
import { useEffect, useState } from 'react';
import { getAllConfigurations } from "../../Utils/Utils";
import Debug from "../Debug/Debug";
import api from "../../admin/api/api";
import Swal from "sweetalert2"

const ContactForm = ({}) => {

  const [configurations, setConfigurations] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (value) => {
    setFormData({ ...formData, recaptcha: value });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    api.post(`${process.env.REACT_APP_API_URL}/api/contact`, formData)
      .then(data => {
        Swal.fire({
          title: "Obrigado pelo contato!",
          text: "Fomos comunicados sobre o seu contato e em breve retornaremos seu contato!",
          icon: "success"
        });

        e.target.reset()
      })
      .catch(err => {
        let text = err?.response?.data?.message || "Houve uma falha no envio do contato! Por favor, entre em contato conosco pelo Whatsapp.";
        
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text,
          footer: `<a href="${configurations && configurations['link-de-contato-falha-do-formulario'] ? configurations['link-de-contato-falha-do-formulario'].value : "#"}">Tente outra forma de contato, clicando aqui.</a>`
        });
      })

  };

  useEffect(() => {
    getAllConfigurations()
      .then(data => {
        setConfigurations(data || false);
      })
      .catch(err => console.error(err))
  }, []);

  return <>
      <section className="px-8 py-8 lg:py-4">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-2 items-start">
            { configurations &&  configurations['texto-da-secao-contato-da-home']
              ? <Typography
                className="mb-10 font-normal !text-lg lg:mb-20 mx-auto max-w-3xl !text-gray-500"
                dangerouslySetInnerHTML={{ __html: configurations['texto-da-secao-contato-da-home'].value }}
              />
              : null
            }
            
            <form action="#" className="flex flex-col gap-4 lg:max-w-sm" onSubmit={handleSubmit}>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-left font-medium !text-gray-100"
                >
                  Nome
                </Typography>
                <Input
                  color="white"
                  size="lg"
                  placeholder="Seu Nome"
                  name="name"
                  onChange={handleChange}
                  className="focus:border-t-gray-100"
                  containerProps={{
                    className: "min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                  required={true}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-left font-medium !text-gray-100"
                >
                  Seu Email
                </Typography>
                <Input
                  type="email"
                  color="white"
                  size="lg"
                  placeholder="seu@email.com"
                  name="email"
                  onChange={handleChange}
                  className="focus:border-t-gray-100"
                  containerProps={{
                    className: "min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                  required={true}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-left font-medium !text-gray-100"
                >
                  Assunto
                </Typography>
                <Input
                  color="white"
                  size="lg"
                  placeholder="Assunto"
                  name="subject"
                  onChange={handleChange}
                  className="focus:border-t-gray-100"
                  containerProps={{
                    className: "min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                  required={true}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 text-left font-medium !text-gray-100"
                >
                  Sua Mensagem
                </Typography>
                <Textarea
                  rows={6}
                  placeholder="Escreva sua mensagem aqui..."
                  name="message"
                  onChange={handleChange}
                  className="focus:border-t-gray-100 text-white"
                  containerProps={{
                    className: "min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                  required={true}
                />
              </div>
              <Recaptcha handleCaptchaChange={handleCaptchaChange}/>
              <Button type="submit" className="w-full" color="white">
                Enviar Mensagem
              </Button>
            </form>

          </div>
        </div>
      </section>
  </>
};

export default ContactForm;