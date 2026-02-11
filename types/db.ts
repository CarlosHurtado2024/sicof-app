import type { FaseProceso } from '@/lib/case-workflow'

// === ENUMS ===
export type MinutaMotivo = 'ORIENTACION' | 'DENUNCIA' | 'SEGUIMIENTO' | 'AUDIENCIA' | 'OTRO';
export type PersonaTipoDoc = 'CC' | 'TI' | 'CE' | 'PASAPORTE' | 'PPT';
export type PersonaGenero = 'MASCULINO' | 'FEMENINO' | 'TRANS' | 'NO_BINARIO' | 'OTRO';
export type TipologiaViolencia = 'FISICA' | 'PSICOLOGICA' | 'SEXUAL' | 'ECONOMICA' | 'PATRIMONIAL';
export type EstadoCaso = 'TRAMITE' | 'SEGUIMIENTO' | 'CERRADO' | 'ARCHIVO';
export type RiesgoNivel = 'SIN_RIESGO' | 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';
export type TipoMedida = 'PROVISIONAL' | 'DEFINITIVA';
export type RolUsuario = 'COMISARIO' | 'SECRETARIO' | 'PSICOLOGO' | 'TRABAJADOR_SOCIAL' | 'ABOGADO' | 'AUXILIAR' | 'PRACTICANTE' | 'USUARIO_EXTERNO' | 'ADMINISTRADOR';

// === TABLAS PRINCIPALES ===

export interface Minuta {
    id: string;
    fecha_hora_ingreso: string;
    fecha_hora_salida?: string;
    nombre_visitante: string;
    documento_visitante?: string;
    telefono_contacto?: string;
    motivo_visita: MinutaMotivo;
    funcionario_id: string;
    observaciones?: string;
    created_at: string;
}

export interface Persona {
    id: string;
    expediente_id: string;
    tipo: 'VICTIMA' | 'AGRESOR' | 'SOLICITANTE' | 'TERCERO';
    nombres: string;
    documento: string;
    tipo_documento?: PersonaTipoDoc;
    fecha_nacimiento?: string;
    edad_calculada?: number;
    genero?: PersonaGenero;
    direccion_residencia?: string;
    zona?: 'RURAL' | 'URBANA';
    barrio_vereda?: string;
    telefono?: string;
    email?: string;
    autoriza_notificaciones?: boolean;
    nivel_educativo?: string;
    discapacidad?: boolean;
    tipo_discapacidad?: string;
    grupo_etnico?: string;
    es_victima_conflicto?: boolean;
    pertenece_ddhh?: boolean;
    // Aggressor specific
    alias?: string;
    ocupacion?: string;
    acceso_armas?: boolean;
}

export interface Expediente {
    id: string;
    radicado: string;
    fecha_apertura: string;
    estado: EstadoCaso;
    fase_proceso: FaseProceso;
    nivel_riesgo: RiesgoNivel;
    comisaria_id?: string;
    funcionario_psicosocial_id?: string;
    fecha_conocimiento_hechos?: string;
    hechos_relato?: string;
    tipologia_violencia?: TipologiaViolencia;
    fecha_hechos?: string;
    lugar_hechos?: string;
    es_competencia?: boolean;
    descripcion_remision?: string;
    created_at: string;
    // Joined data
    personas?: Persona[];
    valoraciones_riesgo?: ValoracionRiesgo[];
}

export interface Medida {
    id: string;
    expediente_id: string;
    tipo: string;
    categoria: TipoMedida;
    descripcion?: string;
    fundamento_legal?: string;
    dictada_por?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    estado: string;
    created_at: string;
}

export interface Actuacion {
    id: string;
    expediente_id: string;
    tipo: string;
    contenido?: string;
    archivo_url?: string;
    autor_id?: string;
    created_at: string;
}

export interface ValoracionRiesgo {
    id: string;
    expediente_id: string;
    funcionario_id: string;
    fecha_valoracion: string;
    respuestas_checklist: Record<string, boolean>;
    nivel_riesgo_calculado: RiesgoNivel;
    recomendacion_medidas?: string;
    created_at: string;
}

// === TABLAS NUEVAS (Ley 2126/2021) ===

export interface Seguimiento {
    id: string;
    expediente_id: string;
    funcionario_id: string;
    fecha_programada: string;
    fecha_realizada?: string;
    tipo: 'VERIFICACION_CUMPLIMIENTO' | 'VISITA_DOMICILIARIA' | 'LLAMADA' | 'OTRO';
    resultado?: string;
    cumplimiento?: boolean;
    observaciones?: string;
    created_at: string;
}

export interface Audiencia {
    id: string;
    expediente_id: string;
    tipo: 'MEDIDA_PROTECCION' | 'INCIDENTE_INCUMPLIMIENTO' | 'CONCILIACION_ALIMENTOS';
    fecha_programada: string;
    fecha_realizada?: string;
    estado: 'PROGRAMADA' | 'REALIZADA' | 'APLAZADA' | 'FALLIDA';
    acta_contenido?: string;
    fallo_contenido?: string;
    comisario_id?: string;
    created_at: string;
}

export interface CitacionNotificacion {
    id: string;
    expediente_id: string;
    audiencia_id?: string;
    persona_id?: string;
    tipo: 'CITACION' | 'NOTIFICACION_PERSONAL' | 'NOTIFICACION_AVISO' | 'OFICIO_POLICIA' | 'OFICIO_FISCALIA' | 'OFICIO_EPS';
    medio: 'PERSONAL' | 'CORREO_ELECTRONICO' | 'AVISO' | 'COMISARIO_POLICE';
    fecha_envio?: string;
    fecha_recibido?: string;
    estado: 'PENDIENTE' | 'ENVIADA' | 'RECIBIDA' | 'FALLIDA' | 'DEVUELTA';
    funcionario_id?: string;
    observaciones?: string;
    created_at: string;
}

export interface TerminoLegalDB {
    id: string;
    expediente_id: string;
    tipo: 'MEDIDA_PROVISIONAL_4H' | 'AUDIENCIA_30DIAS' | 'FALLO_10DIAS' | 'INCIDENTE' | 'OTRO';
    fecha_inicio: string;
    fecha_vencimiento: string;
    cumplido: boolean;
    alerta_enviada: boolean;
    created_at: string;
}

export interface IncidenteIncumplimiento {
    id: string;
    expediente_id: string;
    medida_id?: string;
    fecha_reporte: string;
    descripcion_incumplimiento: string;
    sancion_tipo?: 'MULTA' | 'ARRESTO' | 'AMBAS';
    sancion_detalle?: string;
    estado: 'ABIERTO' | 'SANCIONADO' | 'ARCHIVADO';
    comisario_id?: string;
    created_at: string;
}

export interface Usuario {
    id: string;
    email: string;
    nombre: string;
    rol: RolUsuario;
    created_at: string;
}
