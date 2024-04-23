const InpurDate = ({ date }: { date: Date }) => {
    return (
        <input
            type="date"
            name=""
            className="form-section-input"
            id=""
            value={date.toISOString().split("T")[0]}
            onChange={() => {}}
        />
    );
};

export default InpurDate;
