const DriverInstructionsForNewVehicle = () => {
    const STEPS = [
        "Contactate con la misma empresa con la que estas trabajando como chofer.",
        "Pideles que registren tu nuevo vehiculo de la misma forma que te registraron la primera vez.",
    ];

    return (
        <div>
            <h3 className="text | medium bold icon-wrapper margin-top-25">
                Sigue estos pasos para agregar este vehiculo:
            </h3>
            <div className="margin-bottom-25">
                {STEPS.map((m, i) => (
                    <p className="text | margin-top-15" key={`step-${i}`}>
                        <b>{i + 1}.</b> {m}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default DriverInstructionsForNewVehicle;
