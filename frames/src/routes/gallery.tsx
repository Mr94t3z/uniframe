import { Button, Frog } from 'frog';
import { getCollection, getItem } from "../services/uniquery";
import { kodaUrl } from "../utils";
import { $purifyOne } from '@kodadot1/minipfs';
import { HonoEnv } from "../constants";

export const app = new Frog<HonoEnv>({
});

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
  if (!collection || !collection.max) {
    throw new Error("The collection should have a maximum");
  }
  const { image, max, name } = collection;
  const label = `Browse:${name}[${max}]`;
  return c.res({
    title: name,
    image: $purifyOne(image, "kodadot_beta"),
    intents: [<Button action={`/view/${chain}/${id}/1`} value={max}>{label}</Button>],
  });
});

app.frame("/view/:chain/:id/:curr", async (c) => {
  const { chain, id, curr } = c.req.param();
  const { buttonValue } = c;
  let max = Number(buttonValue);
  if (isNaN(max) || max === 0) {
    throw new Error("The max must be a number");
  }
  max = Math.min(max, 34);
  const item = await fetchItem(chain, id, curr);
  const image = item ? $purifyOne(item.image, "kodadot_beta") : null;
  const random = Math.floor(Math.random() * max) + 1;
  return c.res({
    image: image || "", // Handle potential null value
    intents: [
      parseInt(curr) > 1 ? (
        <Button value={`${max}`} action={`/view/${chain}/${id}/${parseInt(curr) - 1}/`}> ⬅️ </Button>
      ) : null,
      <Button value={`${max}`} action={`/view/${chain}/${id}/${parseInt(curr) + 1}/`}> ➡️ </Button>,
      <Button action={`/view/${chain}/${id}/${random}`} value={`${max}`}> 🎲 </Button>,
      <Button.Link href={kodaUrl(chain, id, curr) || ""}>🖼️</Button.Link>, // Handle potential null value
    ],
  });
});

export default app;
