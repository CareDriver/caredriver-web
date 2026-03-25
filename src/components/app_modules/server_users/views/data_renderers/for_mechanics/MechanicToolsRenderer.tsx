import ScrewdriverWrench from "@/icons/ScrewdriverWrench";
import FieldDeleted from "../../../../../form/view/field_renderers/FieldDeleted";
import TextFieldRenderer from "@/components/form/view/field_renderers/TextFieldRenderer";
import {
  MechanicSubService,
  MechanicToolEvidence,
  TechnicalTitleEvidence,
} from "@/interfaces/UserRequest";
import ImageRenderer from "@/components/form/view/field_renderers/ImageRenderer";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";

interface Props {
  tools: string | undefined;
  subServices?: MechanicSubService[];
  toolEvidences?: MechanicToolEvidence[];
  technicalTitle?: TechnicalTitleEvidence;
  experience?: string;
  isUpdateRequest?: boolean;
}

const MechanicToolsRenderer: React.FC<Props> = ({
  tools,
  subServices,
  toolEvidences,
  technicalTitle,
  experience,
  isUpdateRequest,
}) => {
  return (
    <div className="form-sub-container | margin-top-25">
      <h2 className="text icon-wrapper | medium-big bold">
        <ScrewdriverWrench />
        {isUpdateRequest
          ? "Actualización de herramientas"
          : "Herramientas de trabajo"}
      </h2>
      {tools ? (
        <TextFieldRenderer content={tools} legend="Herramientas" />
      ) : (
        <FieldDeleted
          description={
            "El usuario que solicito ser mecánico no especifico sus herramientas de trabajo"
          }
        />
      )}

      {subServices && subServices.length > 0 ? (
        <div className="form-sub-container | margin-top-15">
          <h3 className="text | medium bold">Subservicios mecánicos</h3>
          {subServices.map((subService, index) => (
            <TextFieldRenderer
              key={`${subService}-${index}`}
              content={subService}
              legend={`Subservicio ${index + 1}`}
            />
          ))}
        </div>
      ) : (
        <FieldDeleted description="No seleccionó subservicios mecánicos." />
      )}

      {toolEvidences && toolEvidences.length > 0 ? (
        <div className="margin-top-15">
          {toolEvidences.map((tool, index) => (
            <div key={`${tool.name}-${index}`} className="margin-bottom-15">
              <TextFieldRenderer
                content={tool.name}
                legend={`Herramienta ${index + 1}`}
              />
              <ImageRenderer
                content={{
                  image: tool.photo,
                  legend: `Foto herramienta ${index + 1}`,
                }}
                imageInCircle={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <FieldDeleted description="No se adjuntaron fotos de herramientas." />
      )}

      {technicalTitle ? (
        <div className="margin-top-15">
          <TextFieldRenderer
            content={technicalTitle.titleName}
            legend="Título técnico"
          />
          {technicalTitle.issueDate && (
            <TextFieldRenderer
              content={timestampDateInSpanish(technicalTitle.issueDate)}
              legend="Fecha del título"
            />
          )}
          <ImageRenderer
            content={{
              image: technicalTitle.photo,
              legend: "Foto del título técnico",
            }}
            imageInCircle={false}
          />
        </div>
      ) : (
        <FieldDeleted description="No adjuntó título técnico." />
      )}

      {experience ? (
        <TextFieldRenderer content={experience} legend="Experiencia" />
      ) : (
        <FieldDeleted description="No agregó experiencia adicional." />
      )}
    </div>
  );
};

export default MechanicToolsRenderer;
