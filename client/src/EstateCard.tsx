import { Card, Image, Text } from "@mantine/core";

interface IEstateCardProps {
  title: string;
  image: string;
}

const EstateCard = ({ title, image }: IEstateCardProps) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={230} h={260}>
      <Card.Section>
        <Image src={image} height={160} alt="Norway" />
      </Card.Section>
      <Text weight={500} mt="md">
        {title}
      </Text>
    </Card>
  );
};

export default EstateCard;
