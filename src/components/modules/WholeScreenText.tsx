interface Props {
  text: string;
}

const WholeScreenText: React.FC<Props> = ({ text }) => {
  return (
    <div className="empty-wrapper | auto-height max-height-100">
      <h2>{text}</h2>
      <span className="circles-right-bottomv2 green"></span>
    </div>
  );
};

export default WholeScreenText;
