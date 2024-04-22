const InpurDate = ({ date }: { date: Date }) => {
    return (
        <input
            type="date"
            name=""
            className="form-section-input"
            id=""
            value={date.toISOString()}
            onChange={() => {}}
        />
    );
};

export default InpurDate;
