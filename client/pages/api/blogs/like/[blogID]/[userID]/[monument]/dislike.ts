import { NextApiRequest, NextApiResponse } from 'next';
import parse from 'utils/parse';
import prisma from 'utils/prisma';

export default async function like(req: NextApiRequest, res: NextApiResponse) {
  const { blogID, userID, monument } = req.query as {
    blogID: string;
    userID: string;
    monument: string;
  };

  const { likes } = JSON.parse(req.body) as {
    likes: number;
  };

  try {
    console.log(blogID, userID, monument);
    const updateBlog = await prisma.blogs.update({
      where: {
        blogId_userId_monument: {
          blogId: blogID,
          monument: parse(monument),
          userId: userID,
        },
      },
      data: {
        likeCount: likes,
        likes: {
          delete: {
            userId_blogsBlogId: {
              blogsBlogId: blogID,
              userId: userID,
            },
          },
        },
      },
    });
    res.send('ok');
  } catch (e) {
    console.log('NU EXISTA LEGATURA IN BAZA DE DATE');
    res.send({
      error: false,
      message: "YOU DIDN'T LIKE THIS TO BEGIN WITH",
    });
  }
}
