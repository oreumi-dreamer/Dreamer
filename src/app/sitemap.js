import { query, collection, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap() {
  const baseUrls = [
    {
      url: "https://dreamer.today",
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://dreamer.today/privacy",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://dreamer.today/terms",
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://dreamer.today/search",
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const posts = await fetchPublicPosts();

    const postUrls = posts.map((post) => {
      // Firestore 타임스탬프를 Date 객체로 변환
      const lastModified =
        post.updatedAt?.toDate?.() || post.createdAt?.toDate?.() || new Date();

      return {
        url: `https://dreamer.today/post/${post.id}`,
        lastModified: lastModified.toISOString(),
        changeFrequency: "weekly",
        priority: 0.6,
      };
    });

    return [...baseUrls, ...postUrls];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return baseUrls;
  }
}

async function fetchPublicPosts() {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      where("isPrivate", "==", false),
      limit(500)
    );

    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching public posts:", error);
    return [];
  }
}
