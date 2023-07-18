import { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Group,
  MantineProvider,
  Pagination,
  SegmentedControl,
  Stack,
  Title,
  Text,
  Loader,
  Card,
  ScrollArea,
} from "@mantine/core";
import axios from "axios";
import EstateCard from "./EstateCard";

const DEFAULT_PAGE_SIZE = 20;

interface IEstate {
  id: number;
  title: string;
  image: string;
}

interface IEstatesListResponse {
  rows: IEstate[];
  pagesCount: number;
}

const App = () => {
  const activePageUrl = new URLSearchParams(window.location.search).get("page");
  const pageSizeUrl = new URLSearchParams(window.location.search).get("limit");

  const [estates, setEstates] = useState<IEstate[] | undefined>();
  const [activePage, setPage] = useState(
    activePageUrl ? parseInt(activePageUrl) : 1
  );
  const [pageSize, setPageSize] = useState(
    pageSizeUrl ? parseInt(pageSizeUrl) : DEFAULT_PAGE_SIZE
  );
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const estatesEndPoint = `${window.location.origin}/api/estates/list/?page=${activePage}&limit=${pageSize}`;
    axios
      .get<IEstatesListResponse>(estatesEndPoint)
      .then((response) => {
        setEstates(response.data.rows);
        setTotalPages(response.data.pagesCount);
      })
      .catch((err) => {
        console.error(err);
      });

    // update url
    window.history.replaceState(
      {},
      "",
      `?page=${activePage}&limit=${pageSize}`
    );
  }, [activePage, pageSize, setPage]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          opacity: "0.1",
          backgroundImage:
            "linear-gradient(#f74545 1.8px, transparent 1.8px), linear-gradient(to right, #f74545 1.8px, #ffffff 1.8px)",
          backgroundSize: "36px 36px",
        }}
      />
      <ScrollArea w={"100vw"} h={"100vh"}>
        <Container size="xl" mx={"auto"}>
          <Card shadow="sm" radius="sm" my="lg">
            <Stack align="center" my="lg" spacing="xs">
              <Group position="apart" w="100%" px="lg">
                <Group spacing={"xl"}>
                  <Title order={1}>Test project</Title>
                  <Title order={2} mt="auto" color="red">
                    <a
                      href="https://www.sreality.cz/en"
                      style={{ color: "inherit" }}
                    >
                      Sreality.cz
                    </a>{" "}
                    estates list
                  </Title>
                </Group>
                <Group spacing="xs">
                  <Text fw={700}>Per page:</Text>
                  <SegmentedControl
                    data={["10", "20", "50"]}
                    color="red"
                    value={pageSize.toString()}
                    onChange={(value) => {
                      setPageSize(parseInt(value));
                      setPage(1);
                    }}
                  />
                </Group>
              </Group>

              <Flex
                gap="md"
                justify="center"
                align="flex-start"
                direction="row"
                wrap="wrap"
                w="100%"
                my="xl"
              >
                {estates ? (
                  estates.map((user) => <EstateCard key={user.id} {...user} />)
                ) : (
                  <Loader size="xl" my="auto" color="red" />
                )}
              </Flex>
              {estates && (
                <Pagination
                  value={activePage}
                  onChange={setPage}
                  total={totalPages}
                  color="red"
                />
              )}
            </Stack>
          </Card>
        </Container>
      </ScrollArea>
    </MantineProvider>
  );
};

export default App;
