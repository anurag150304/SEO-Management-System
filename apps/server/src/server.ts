import app from "./app";
import { createServer } from "http";
import { env } from "@repo/env-config";

const server = createServer(app);
const PORT = env.PORT || 8000;
server.listen(PORT, () => console.log(`server is listning on port ${PORT}`));
