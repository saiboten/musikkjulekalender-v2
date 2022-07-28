import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const { nick } = req.query;

  const session = await getSession({ req });

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
