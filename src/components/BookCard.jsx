function BookCard({ book }) {
  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition">
      <img
        src={coverUrl}
        alt={book.title}
        className="w-32 h-48 object-cover rounded mb-4"
      />
      <h2 className="font-semibold text-lg text-center">{book.title}</h2>
      <p className="text-gray-600 text-sm">
        {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
      </p>
      <p className="text-gray-500 text-xs">
        First published: {book.first_publish_year || "N/A"}
      </p>
    </div>
  );
}

export default BookCard;
