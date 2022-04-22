import { NextApiRequest, NextApiResponse } from 'next';
import { FailResponse } from 'pages/api/church-info/[church]';
import parse from 'utils/parse';
import prisma from 'utils/prisma';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, title } = req.query as {
      username: string;
      title: string;
    };
    console.log('TITLE IS:', title);
    const blog = JSON.parse(req.body) as {
      content: string;
      id: string;
      monument: string;
    };
    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (user)
      await prisma.blogs.create({
        data: {
          content: blog.content,
          title: title,
          userId: user.id,
          blogId: blog.id + 'xyz',
          monument: parse(blog.monument),
        },
      });
    else {
      res.send({
        error: true,
        payload: 'Trebuie sa fii logat ca sa poti posta ',
      } as FailResponse);
      return;
    }

    res.send({
      error: false,
      payload: 'Totul este perfect !',
    });
    console.log(username, title, 'POST', parse(blog.monument));
  }
}