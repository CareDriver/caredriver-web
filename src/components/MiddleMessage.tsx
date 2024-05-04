const MiddleMessage = ({ message }: { message: string }) => {
    return (
        <div className="empty-wrapper | auto-height max-height-100">
            <h2>{message}</h2>
            <span className="circles-right-bottomv2 green"></span>
        </div>
    );
};

export default MiddleMessage;
