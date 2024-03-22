import { Button, Frog } from 'frog';
import { getCollection, getItem } from "../services/uniquery";
import { kodaUrl } from "../utils";
import { $purifyOne } from '@kodadot1/minipfs';
import { HonoEnv } from "../constants";

export const app = new Frog<HonoEnv>();

async function fetchCollection(chain: string, id: string) {
  try {
    return await getCollection(chain, id);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch collection");
  }
}

async function fetchItem(chain: string, collection: string, id: string) {
  try {
    return await getItem(chain, collection, id);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch item");
  }
}

app.frame("/:chain/:id", async (c) => {
  const { chain, id } = c.req.param();
  const collection = await fetchCollection(chain, id);
  if (!collection || isNaN(collection.max) || collection.max <= 0 || isNaN(collection.supply) || collection.supply <= 0) {
    throw new Error("The collection should have a valid maximum and supply");
  }
  const { image, max, name, supply } = collection;
  const label = `Browse:${name}[${max}]`;
  return c.res({
    title: name,
    image: $purifyOne(image, "kodadot_beta"),
    intents: [<Button action={`/view/${chain}/${id}/1`} value={supply}>{label}</Button>], // Pass supply as value
  });
});

app.frame("/view/:chain/:id/:curr", async (c) => {
  const { chain, id, curr } = c.req.param();
  const { buttonValue } = c;
  let max = Number(buttonValue);
  const collection = await fetchCollection(chain, id);
  if (!collection || isNaN(collection.supply) || collection.supply <= 0) { // Ensure supply is present and valid
    throw new Error("The collection should have a valid supply");
  }
  max = Math.max(max, 1); // Ensure max is at least 1
  max = Math.min(max, collection.supply); // Ensure max does not exceed collection supply
  const item = await fetchItem(chain, id, curr);
  const image = item ? $purifyOne(item.image, "kodadot_beta") : null;
  const random = Math.floor(Math.random() * max) + 1;
  return c.res({
    image: image || "",
    intents: [
      parseInt(curr) > 1 ? (
        <Button value={`${max}`} action={`/view/${chain}/${id}/${parseInt(curr) - 1}/`}>⬅️</Button>
      ) : null,
      <Button value={`${max}`} action={`/view/${chain}/${id}/${parseInt(curr) + 1}/`}>➡️</Button>,
      <Button action={`/view/${chain}/${id}/${random}`} value={`${max}`}>🎲</Button>,
      <Button.Link href={kodaUrl(chain, id, curr) || ""}>🖼️</Button.Link>,
    ],
  });
});

export default app;
