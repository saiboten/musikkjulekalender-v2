import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { nick } = req.query;

  const session = await getServerSession(req, res, authOptions);

  if (nick && nick.length > 3) {
    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        nickname: nick,
      },
    });
    res.status(200).json({ success: true });
  } else {
    res.status(500).send({ message: "Noe gikk galt" });
  }
}
