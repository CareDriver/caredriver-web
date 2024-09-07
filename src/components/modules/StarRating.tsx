const StarRating = ({ rating }: { rating: number }) => {
    const maxStars = 5;
    const roundedRating = Math.round(rating);

    return (
        <div className="text">
            <b className="text | bold">Calificacion: </b>
            {[...Array(maxStars)].map((_, index) => (
                <span key={index}>{index < roundedRating ? "★" : "☆"}</span>
            ))}
        </div>
    );
};

export default StarRating;
