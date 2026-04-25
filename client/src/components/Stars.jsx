export default function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4 && rating - full < 0.9;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <>
      {Array.from({ length: full }).map((_, i) => <i key={`f${i}`} className="fa-solid fa-star" />)}
      {half && <i className="fa-solid fa-star-half-stroke" />}
      {Array.from({ length: empty }).map((_, i) => <i key={`e${i}`} className="fa-regular fa-star" />)}
    </>
  );
}
