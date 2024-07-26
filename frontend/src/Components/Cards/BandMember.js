import { Button, Card, CardHeader, Typography, CardBody, CardFooter } from "@material-tailwind/react";

const BandMember = ({photoSrc, name, position, description}) => {
  return <Card>
    <CardHeader color="blue-gray" className="relative h-56">
      <img
        src={photoSrc}
        alt="card-image"
      />
    </CardHeader>
    <CardBody className="text-center">
      <Typography variant="h4" color="blue-gray" className="mb-2">
        {name}
      </Typography>
      <Typography color="blue-gray" className="font-medium" textGradient>
        {position}
      </Typography>
      <Typography variant="lead" color="gray" className="mt-3 font-normal" dangerouslySetInnerHTML={{__html: description}} />
    </CardBody>
    {/* <CardFooter className="pt-0">
      <Button>Read More</Button>
    </CardFooter> */}
  </Card>
}

export default BandMember;