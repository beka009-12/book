import { FC, useEffect, useState } from "react";
import scss from "./DetailsPage.module.scss";
import {
  FaUser,
  FaCalendarAlt,
  FaRegClock,
  FaEye,
  FaHeart,
  FaBookOpen,
  FaDownload,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBookByIdQuery } from "../../store/api/book";
import SimilarBooks from "./similar/SimilarBooks";
import not from "../../assets/notFound.svg";
import Loader from "../../ui/loader/Loader";
import { useUserId, useViewLogic } from "../../hooks/use-user-id";
import { useLikeBook } from "../../hooks/like/Like";

const DetailsPage: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, refetch } = useGetBookByIdQuery(Number(id));
  const userId = useUserId(id);
  const [isDownloading, setIsDownloading] = useState(false);
  useViewLogic(id, userId);

  const { isLiked, setIsLiked, handleLike } = useLikeBook(id, userId, refetch);
  const [showSparks, setShowSparks] = useState(false);

  // Функция для показа искр при лайке
  const handleLikeWithAnimation = () => {
    handleLike();
    setShowSparks(true);
    setTimeout(() => setShowSparks(false), 1000);
  };

  useEffect(() => {
    if (!id) return;

    try {
      const stored = localStorage.getItem("Liked-Books");
      const likedBooks = stored ? JSON.parse(stored) : [];
      if (Array.isArray(likedBooks)) {
        setIsLiked(likedBooks.includes(id) || (book?.is_liked ?? false));
      }
    } catch (error) {
      console.error("Error parsing Liked-Books:", error);
    }
  }, [id, book, setIsLiked]);

  if (isLoading) return <Loader />;

  if (!book) {
    return (
      <div className={scss.notFound}>
        <img src={not} alt="Not Found" />
      </div>
    );
  }

  const fixImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http://80.242.57.16:8080")) return url;
    if (url.startsWith("http://80.242.57.16"))
      return url.replace("http://80.242.57.16", "http://80.242.57.16:8080");
    return url;
  };

  // ✅ Временное решение - используем CORS proxy
  const handleDownload = async () => {
    if (!id) return;

    setIsDownloading(true);

    try {
      // CORS proxy для обхода Mixed Content
      const targetUrl = `http://80.242.57.16:8080/books/${id}/download/`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

      console.log("Downloading from:", proxyUrl);

      const response = await fetch(proxyUrl, {
        method: "GET",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${book.book_name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error("Download error:", error);
      alert("Ката кетти! Файлды жүктөөгө болбоду.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className={scss.DetailsPage}>
      <div className="container">
        <div className={scss.block}>
          <div className={scss.card}>
            <div className={scss.info}>
              <h1>{book.book_name}</h1>
              <p className={scss.aftor}>
                <FaUser /> <strong>Автор:</strong> {book.book_author}
              </p>
              <p>
                <FaCalendarAlt /> <strong>Басылган жылы:</strong>{" "}
                {book.publication_year}
              </p>
              <p>
                <FaRegClock /> <strong>Жүктөлгөн убакыт:</strong>{" "}
                {book.loading_time}
              </p>
              <div className={scss.top}>
                <p className={scss.rating}>
                  <FaEye /> <strong>Көрүүлөр:</strong>{" "}
                  <span>{book.viewing_count}</span>
                </p>
                <p className={scss.rating}>
                  <FaHeart /> <strong>Жакты:</strong>{" "}
                  <span>{book.like_count}</span>
                </p>
              </div>

              <p className={scss.description}>{book.description}</p>

              <div className={scss.buttons}>
                {fixImageUrl(book.book_pdf) ? (
                  <a
                    href={fixImageUrl(book.book_pdf) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={scss.read}
                  >
                    <FaBookOpen /> Онлайн окуу
                  </a>
                ) : (
                  <button
                    className={scss.read}
                    disabled
                    title="PDF табылган жок"
                  >
                    <FaBookOpen /> Онлайн окуу
                  </button>
                )}

                <button
                  disabled={isDownloading || !id}
                  onClick={handleDownload}
                  className={scss.download}
                  style={{
                    cursor: isDownloading ? "not-allowed" : "pointer",
                    opacity: isDownloading ? 0.7 : 1,
                  }}
                >
                  <FaDownload style={{ marginRight: "8px" }} />
                  {isDownloading ? "Жүктөлүп жатат..." : "Жүктөө"}
                </button>

                <button onClick={handleLikeWithAnimation} className={scss.like}>
                  <FaHeart
                    style={{
                      color: isLiked ? "red" : "white",
                      transform: showSparks ? "scale(1.3)" : "scale(1)",
                      transition: "transform 0.2s ease",
                    }}
                  />{" "}
                  Жакты
                  {showSparks && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: "8px",
                            height: "8px",
                            background: isLiked ? "red" : "#ff6b6b",
                            borderRadius: "50%",
                            animation: `spark-${i} 0.6s ease-out forwards`,
                            pointerEvents: "none",
                          }}
                        />
                      ))}
                      <style>{`
                        @keyframes spark-0 {
                          to {
                            transform: translate(-30px, -30px);
                            opacity: 0;
                          }
                        }
                        @keyframes spark-1 {
                          to {
                            transform: translate(30px, -30px);
                            opacity: 0;
                          }
                        }
                        @keyframes spark-2 {
                          to {
                            transform: translate(-30px, 30px);
                            opacity: 0;
                          }
                        }
                        @keyframes spark-3 {
                          to {
                            transform: translate(30px, 30px);
                            opacity: 0;
                          }
                        }
                        @keyframes spark-4 {
                          to {
                            transform: translate(-40px, 0);
                            opacity: 0;
                          }
                        }
                        @keyframes spark-5 {
                          to {
                            transform: translate(40px, 0);
                            opacity: 0;
                          }
                        }
                        @keyframes spark-6 {
                          to {
                            transform: translate(0, -40px);
                            opacity: 0;
                          }
                        }
                        @keyframes spark-7 {
                          to {
                            transform: translate(0, 40px);
                            opacity: 0;
                          }
                        }
                      `}</style>
                    </>
                  )}
                </button>

                <button onClick={() => navigate("/")} className={scss.back}>
                  ← Артка
                </button>
              </div>
            </div>

            <div className={scss.image}>
              <img
                src={
                  fixImageUrl(book.book_image) ||
                  "https://static.vecteezy.com/system/resources/previews/009/007/126/non_2x/document-file-not-found-search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                }
                alt={book.book_name}
              />
            </div>
          </div>
          <SimilarBooks category={book.category} currentBookId={book.id} />
        </div>
      </div>
    </section>
  );
};

export default DetailsPage;
