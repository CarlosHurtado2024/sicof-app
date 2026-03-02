
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { verificarCompetencia, generarAutoRemision, CompetenciaResultado } from '@/lib/competence-logic'
import { radicarCaso } from '@/lib/actions/triage'
import {
    User, Users, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Shield,
    ChevronRight, ChevronLeft, Loader2, Baby, Heart, Scale, Gavel, ArrowRight,
    X
} from 'lucide-react'

// ========== TYPES ==========
type FormData = {
    victima: {
        nombres: string;
        documento: string;
        tipo_documento: 'CC' | 'TI' | 'CE' | 'PASAPORTE' | 'PPT';
        fecha_nacimiento: string;
        genero: string;
        identidad_genero: string;
        direccion: string;
        barrio: string;
        zona: 'URBANA' | 'RURAL';
        telefono: string;
        email: string;
        nivel_educativo: string;
        grupo_etnico: string;
        discapacidad: boolean;
        tipo_discapacidad: string;
        es_victima_conflicto: boolean;
        estado_civil: string;
        eps: string;
    };
    agresor: {
        nombres: string;
        documento: string;
        tipo_documento: string;
        alias: string;
        genero: string;
        direccion: string;
        telefono: string;
        acceso_armas: boolean;
        parentesco: string;
        ocupacion: string;
    };
    caso: {
        hechos_relato: string;
        tipologia: 'FISICA' | 'PSICOLOGICA' | 'SEXUAL' | 'ECONOMICA' | 'PATRIMONIAL';
        ambito: 'FAMILIAR' | 'NO_FAMILIAR';
        fecha_hechos: string;
        lugar_hechos: string;
        hechos_lugar_municipio: boolean;
        victima_domicilio_municipio: boolean;
        es_competencia: boolean;
        hay_nna_victima_sexual_en_familia: boolean;
    }
};

const INITIAL_DATA: FormData = {
    victima: {
        nombres: '', documento: '', tipo_documento: 'CC', fecha_nacimiento: '', genero: 'FEMENINO',
        identidad_genero: '', direccion: '', barrio: '', zona: 'URBANA', telefono: '', email: '',
        nivel_educativo: '', grupo_etnico: '', discapacidad: false, tipo_discapacidad: '',
        es_victima_conflicto: false, estado_civil: '', eps: ''
    },
    agresor: {
        nombres: '', documento: '', tipo_documento: 'CC', alias: '', genero: '', direccion: '',
        telefono: '', acceso_armas: false, parentesco: '', ocupacion: ''
    },
    caso: {
        hechos_relato: '', tipologia: 'FISICA', ambito: 'FAMILIAR', fecha_hechos: '', lugar_hechos: '',
        hechos_lugar_municipio: true, victima_domicilio_municipio: true, es_competencia: false,
        hay_nna_victima_sexual_en_familia: false
    }
};

const PARENTESCOS = [
    { value: 'PAREJA', label: 'Pareja / Cónyuge' },
    { value: 'EX_PAREJA', label: 'Ex Pareja' },
    { value: 'PADRE_MADRE', label: 'Padre / Madre' },
    { value: 'HIJO_A', label: 'Hijo(a)' },
    { value: 'HERMANO_A', label: 'Hermano(a)' },
    { value: 'ABUELO_A', label: 'Abuelo(a)' },
    { value: 'TIO_A', label: 'Tío(a)' },
    { value: 'PRIMO_A', label: 'Primo(a)' },
    { value: 'SUEGRO_A', label: 'Suegro(a)' },
    { value: 'CUNADO_A', label: 'Cuñado(a)' },
    { value: 'PADRASTRO_MADRASTRA', label: 'Padrastro / Madrastra' },
    { value: 'OTRO_FAMILIAR', label: 'Otro familiar' },
];

const STEPS = [
    { id: 1, label: 'Víctima', icon: User, description: 'Datos de la parte accionante' },
    { id: 2, label: 'Agresor', icon: ShieldAlert, description: 'Datos del presunto agresor' },
    { id: 3, label: 'Hechos', icon: FileText, description: 'Relato y competencia legal' },
    { id: 4, label: 'Confirmar', icon: CheckCircle2, description: 'Revisión final y radicación' },
];

// ========== UTILITY ==========
function calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

// ========== SELECT COMPONENT ==========
function StyledSelect({ value, onChange, options, placeholder, required = false, className = '' }: {
    value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string; required?: boolean; className?: string;
}) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all ${className}`}
        >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    )
}

// ========== MAIN COMPONENT ==========
export function TriageForm() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<FormData>(INITIAL_DATA);
    const [competenciaResult, setCompetenciaResult] = useState<CompetenciaResultado | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAutoRemision, setShowAutoRemision] = useState(false);
    const [modalState, setModalState] = useState<{
        open: boolean;
        type: 'success' | 'error';
        radicado?: string;
        message?: string;
    }>({ open: false, type: 'success' });

    const updateField = (section: keyof FormData, field: string, value: any) => {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    // Calculated values
    const edadVictima = useMemo(() => calcularEdad(data.victima.fecha_nacimiento), [data.victima.fecha_nacimiento]);
    const esNNA = edadVictima > 0 && edadVictima < 18;
    const esSexual = data.caso.tipologia === 'SEXUAL';

    // Real-time competence check when on step 3
    useEffect(() => {
        if (step === 3) {
            const result = verificarCompetencia({
                hechos_lugar_municipio: data.caso.hechos_lugar_municipio,
                victima_domicilio_municipio: data.caso.victima_domicilio_municipio,
                es_violencia_intrafamiliar: data.caso.ambito === 'FAMILIAR',
                agresor_es_familiar: data.caso.ambito === 'FAMILIAR' && !!data.agresor.parentesco,
                victima_es_nna: esNNA,
                edad_victima: edadVictima,
                es_violencia_sexual: esSexual,
                tipologia: data.caso.tipologia,
                hay_nna_victima_sexual_en_familia: data.caso.hay_nna_victima_sexual_en_familia,
                parentesco: data.agresor.parentesco,
            });
            setCompetenciaResult(result);
            updateField('caso', 'es_competencia', result.es_competente);
        }
    }, [
        step, data.caso.hechos_lugar_municipio, data.caso.victima_domicilio_municipio,
        data.caso.ambito, data.agresor.parentesco, esNNA, edadVictima, esSexual,
        data.caso.tipologia, data.caso.hay_nna_victima_sexual_en_familia
    ]);

    const handleNext = () => {
        // Validate each step
        if (step === 1) {
            console.log('Validando Paso 1, data.victima:', data.victima);

            if (!data.victima.nombres || data.victima.nombres.trim() === '') {
                alert('⚠️ Campo requerido vacío: Nombres Completos de la Víctima');
                return;
            }
            if (!data.victima.documento || data.victima.documento.trim() === '') {
                alert('⚠️ Campo requerido vacío: Número de Documento de la Víctima');
                return;
            }
            if (!data.victima.fecha_nacimiento) {
                alert('⚠️ Campo requerido vacío: Fecha de Nacimiento de la Víctima');
                return;
            }
            if (!data.victima.grupo_etnico || data.victima.grupo_etnico === '') {
                alert('⚠️ Campo requerido vacío: Pertenencia Étnica (Enfoque Diferencial)\n\nPor favor seleccione una opción del menú desplegable.');
                return;
            }
        }
        if (step === 2) {
            console.log('Validando Paso 2, data.agresor:', data.agresor);

            if (!data.agresor.nombres || data.agresor.nombres.trim() === '') {
                alert('⚠️ Campo requerido vacío: Nombres del Presunto Agresor');
                return;
            }
            if (!data.agresor.parentesco || data.agresor.parentesco === '') {
                alert('⚠️ Campo requerido vacío: Relación/Parentesco con la Víctima\n\nPor favor seleccione una opción del menú desplegable.');
                return;
            }
        }
        if (step === 3) {
            console.log('Validando Paso 3, data.caso:', data.caso);

            if (!data.caso.hechos_relato || data.caso.hechos_relato.trim().length < 20) {
                alert(`⚠️ El relato de hechos es obligatorio y debe tener al menos 20 caracteres.\n\nActualmente tiene: ${data.caso.hechos_relato.length} caracteres.`);
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // @ts-ignore
            const result = await radicarCaso(data);
            if (result.success) {
                setModalState({ open: true, type: 'success', radicado: result.radicado });
            } else {
                setModalState({ open: true, type: 'error', message: result.error });
            }
        } catch (error: any) {
            setModalState({ open: true, type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    // ========== RENDER ==========
    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">

            {/* STEPPER */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = step === s.id;
                        const isDone = step > s.id;

                        return (
                            <div key={s.id} className="flex items-center flex-1">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDone ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' :
                                        isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-110' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                    </div>
                                    <div className="hidden md:block">
                                        <p className={`text-sm font-semibold ${isActive ? 'text-blue-700' : isDone ? 'text-emerald-700' : 'text-slate-400'}`}>
                                            {s.label}
                                        </p>
                                        <p className="text-xs text-slate-400">{s.description}</p>
                                    </div>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 rounded-full transition-colors ${isDone ? 'bg-emerald-400' : 'bg-slate-100'
                                        }`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* NNA ALERT BANNER */}
            {esNNA && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <Baby className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-amber-800">
                            NNA Detectado — Edad: {edadVictima} años
                        </p>
                        <p className="text-xs text-amber-600">
                            Se activarán protocolos especiales según Ley 1098 de 2006 (Código de Infancia y Adolescencia)
                        </p>
                    </div>
                </div>
            )}

            {/* MAIN CARD */}
            <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {step === 1 && <><User className="h-5 w-5 text-blue-500" /> Datos de la Víctima</>}
                        {step === 2 && <><ShieldAlert className="h-5 w-5 text-orange-500" /> Datos del Agresor</>}
                        {step === 3 && <><Scale className="h-5 w-5 text-slate-700" /> Hechos y Competencia Legal</>}
                        {step === 4 && <><Gavel className="h-5 w-5 text-emerald-500" /> Confirmación y Radicación</>}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && 'Caracterización sociodemográfica de la parte accionante (enfoque diferencial obligatorio)'}
                        {step === 2 && 'Identificación del presunto agresor y su relación con la víctima'}
                        {step === 3 && 'Relato de hechos y verificación automática de competencia según Ley 2126/2021'}
                        {step === 4 && 'Revisión del resultado de competencia y acciones a seguir'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-5">

                    {/* ================ PASO 1: VÍCTIMA ================ */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Identification */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-blue-500 rounded-full" /> Identificación
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Nombres Completos *</Label>
                                        <Input value={data.victima.nombres} onChange={e => updateField('victima', 'nombres', e.target.value)} placeholder="Nombres y apellidos" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Tipo de Documento *</Label>
                                        <StyledSelect
                                            value={data.victima.tipo_documento}
                                            onChange={v => updateField('victima', 'tipo_documento', v)}
                                            options={[
                                                { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
                                                { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
                                                { value: 'CE', label: 'Cédula de Extranjería (CE)' },
                                                { value: 'PPT', label: 'Permiso Protección Temporal (PPT)' },
                                                { value: 'PASAPORTE', label: 'Pasaporte' }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Número de Documento *</Label>
                                        <Input
                                            value={data.victima.documento}
                                            onChange={e => updateField('victima', 'documento', e.target.value)}
                                            placeholder="Escriba el número de documento"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Fecha de Nacimiento *</Label>
                                        <Input type="date" value={data.victima.fecha_nacimiento} onChange={e => updateField('victima', 'fecha_nacimiento', e.target.value)} />
                                        {data.victima.fecha_nacimiento && (
                                            <div className={`flex items-center gap-1.5 mt-1 ${esNNA ? 'text-amber-600' : 'text-slate-500'}`}>
                                                {esNNA ? <Baby className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                                <span className="text-xs font-medium">
                                                    {edadVictima} años {esNNA ? '— NNA' : '— Adulto'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Demographics */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-slate-700 rounded-full" /> Datos Sociodemográficos
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Sexo *</Label>
                                        <StyledSelect value={data.victima.genero} onChange={v => updateField('victima', 'genero', v)}
                                            options={[
                                                { value: 'FEMENINO', label: 'Femenino' }, { value: 'MASCULINO', label: 'Masculino' },
                                                { value: 'INTERSEXUAL', label: 'Intersexual' }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Identidad de Género</Label>
                                        <StyledSelect value={data.victima.identidad_genero} onChange={v => updateField('victima', 'identidad_genero', v)}
                                            placeholder="Seleccione..."
                                            options={[
                                                { value: 'CISGÉNERO', label: 'Cisgénero' }, { value: 'TRANSGÉNERO', label: 'Transgénero' },
                                                { value: 'NO_BINARIO', label: 'No Binario' }, { value: 'OTRO', label: 'Otro' }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Estado Civil</Label>
                                        <StyledSelect value={data.victima.estado_civil} onChange={v => updateField('victima', 'estado_civil', v)}
                                            placeholder="Seleccione..."
                                            options={[
                                                { value: 'SOLTERO', label: 'Soltero(a)' }, { value: 'CASADO', label: 'Casado(a)' },
                                                { value: 'UNION_LIBRE', label: 'Unión Libre' }, { value: 'DIVORCIADO', label: 'Divorciado(a)' },
                                                { value: 'VIUDO', label: 'Viudo(a)' }, { value: 'SEPARADO', label: 'Separado(a)' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Differential Approach (MANDATORY) */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-rose-500 rounded-full" /> Enfoque Diferencial
                                    <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">OBLIGATORIO</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-rose-700">Pertenencia Étnica *</Label>
                                        <StyledSelect value={data.victima.grupo_etnico} onChange={v => updateField('victima', 'grupo_etnico', v)}
                                            placeholder="Seleccione..." required
                                            options={[
                                                { value: 'NINGUNO', label: 'Ninguno' }, { value: 'INDIGENA', label: 'Indígena' },
                                                { value: 'AFRODESCENDIENTE', label: 'Afrodescendiente' }, { value: 'RAIZAL', label: 'Raizal' },
                                                { value: 'PALENQUERO', label: 'Palenquero' }, { value: 'ROM', label: 'Pueblo Rom' }
                                            ]}
                                        />
                                        {data.victima.grupo_etnico && data.victima.grupo_etnico !== 'NINGUNO' && (
                                            <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                                <AlertTriangle className="h-3 w-3" /> Se activará ruta diferencial étnica
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Discapacidad</Label>
                                        <div className="flex items-center gap-3 pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={data.victima.discapacidad} onChange={e => updateField('victima', 'discapacidad', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
                                                <span className="text-sm">Sí</span>
                                            </label>
                                        </div>
                                        {data.victima.discapacidad && (
                                            <Input value={data.victima.tipo_discapacidad} onChange={e => updateField('victima', 'tipo_discapacidad', e.target.value)}
                                                placeholder="Tipo de discapacidad" className="mt-2" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Víctima Conflicto Armado</Label>
                                        <div className="flex items-center gap-3 pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={data.victima.es_victima_conflicto} onChange={e => updateField('victima', 'es_victima_conflicto', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
                                                <span className="text-sm">Sí, registrada en RUV</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Location */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-teal-500 rounded-full" /> Contacto y Ubicación
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-sm font-medium">Dirección de Residencia</Label>
                                        <Input value={data.victima.direccion} onChange={e => updateField('victima', 'direccion', e.target.value)} placeholder="Dirección completa" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Barrio / Vereda</Label>
                                        <Input value={data.victima.barrio} onChange={e => updateField('victima', 'barrio', e.target.value)} placeholder="Barrio o vereda" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Zona</Label>
                                        <StyledSelect value={data.victima.zona} onChange={v => updateField('victima', 'zona', v as any)}
                                            options={[{ value: 'URBANA', label: 'Urbana' }, { value: 'RURAL', label: 'Rural' }]} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Teléfono</Label>
                                        <Input value={data.victima.telefono} onChange={e => updateField('victima', 'telefono', e.target.value)} placeholder="300 123 4567" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">EPS / Régimen de Salud</Label>
                                        <Input value={data.victima.eps} onChange={e => updateField('victima', 'eps', e.target.value)} placeholder="Nombre de la EPS" />
                                    </div>
                                </div>
                            </div>

                            {/* Education */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Nivel Educativo</Label>
                                    <StyledSelect value={data.victima.nivel_educativo} onChange={v => updateField('victima', 'nivel_educativo', v)}
                                        placeholder="Seleccione..."
                                        options={[
                                            { value: 'NINGUNO', label: 'Ninguno' }, { value: 'PRIMARIA', label: 'Primaria' },
                                            { value: 'SECUNDARIA', label: 'Secundaria' }, { value: 'TECNICO', label: 'Técnico/Tecnólogo' },
                                            { value: 'PROFESIONAL', label: 'Profesional' }, { value: 'POSTGRADO', label: 'Postgrado' }
                                        ]}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Correo Electrónico</Label>
                                    <Input type="email" value={data.victima.email} onChange={e => updateField('victima', 'email', e.target.value)} placeholder="correo@ejemplo.com" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================ PASO 2: AGRESOR ================ */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-orange-500 rounded-full" /> Identificación del Agresor
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Nombres Completos *</Label>
                                        <Input value={data.agresor.nombres} onChange={e => updateField('agresor', 'nombres', e.target.value)} placeholder="Nombres y apellidos" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Alias / Apodo</Label>
                                        <Input value={data.agresor.alias} onChange={e => updateField('agresor', 'alias', e.target.value)} placeholder="Si se conoce" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Tipo de Documento</Label>
                                        <StyledSelect
                                            value={data.agresor.tipo_documento}
                                            onChange={v => updateField('agresor', 'tipo_documento', v)}
                                            options={[
                                                { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
                                                { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
                                                { value: 'CE', label: 'Cédula de Extranjería (CE)' },
                                                { value: 'PPT', label: 'Permiso Protección Temporal (PPT)' }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Número de Documento</Label>
                                        <Input
                                            value={data.agresor.documento}
                                            onChange={e => updateField('agresor', 'documento', e.target.value)}
                                            placeholder="Si se conoce"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Género</Label>
                                        <StyledSelect value={data.agresor.genero} onChange={v => updateField('agresor', 'genero', v)}
                                            placeholder="Seleccione..."
                                            options={[{ value: 'MASCULINO', label: 'Masculino' }, { value: 'FEMENINO', label: 'Femenino' }, { value: 'OTRO', label: 'Otro' }]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Parentesco — Critical field */}
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                <h3 className="text-sm font-semibold text-orange-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Heart className="h-4 w-4" /> Relación con la Víctima
                                    <span className="text-[10px] bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-bold">OBLIGATORIO</span>
                                </h3>
                                <StyledSelect value={data.agresor.parentesco} onChange={v => updateField('agresor', 'parentesco', v)}
                                    placeholder="Seleccione el parentesco..." required
                                    options={PARENTESCOS}
                                />
                                {data.agresor.parentesco && (
                                    <p className="mt-2 text-xs text-orange-700 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Relación registrada: {PARENTESCOS.find(p => p.value === data.agresor.parentesco)?.label}
                                        {data.caso.ambito === 'FAMILIAR' && ' — Contexto familiar confirmado'}
                                    </p>
                                )}
                            </div>

                            {/* Contact & Additional */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-slate-400 rounded-full" /> Datos Adicionales
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Dirección para Notificación</Label>
                                        <Input value={data.agresor.direccion} onChange={e => updateField('agresor', 'direccion', e.target.value)} placeholder="Dirección" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Teléfono</Label>
                                        <Input value={data.agresor.telefono} onChange={e => updateField('agresor', 'telefono', e.target.value)} placeholder="Teléfono" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Ocupación</Label>
                                        <Input value={data.agresor.ocupacion} onChange={e => updateField('agresor', 'ocupacion', e.target.value)} placeholder="Ocupación u oficio" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Acceso a Armas</Label>
                                        <div className="flex items-center gap-3 pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={data.agresor.acceso_armas} onChange={e => updateField('agresor', 'acceso_armas', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-400" />
                                                <span className="text-sm">Sí, tiene acceso a armas</span>
                                            </label>
                                        </div>
                                        {data.agresor.acceso_armas && (
                                            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                                                <AlertTriangle className="h-3 w-3" /> Factor de riesgo alto — Se notificará al valorar riesgo
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================ PASO 3: HECHOS Y COMPETENCIA ================ */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Fecha de los Hechos *</Label>
                                    <Input type="date" value={data.caso.fecha_hechos} onChange={e => updateField('caso', 'fecha_hechos', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Lugar de los Hechos</Label>
                                    <Input value={data.caso.lugar_hechos} onChange={e => updateField('caso', 'lugar_hechos', e.target.value)} placeholder="Dirección o lugar" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Tipología de Violencia *</Label>
                                    <StyledSelect value={data.caso.tipologia} onChange={v => updateField('caso', 'tipologia', v)}
                                        options={[
                                            { value: 'FISICA', label: '🤕 Física' }, { value: 'PSICOLOGICA', label: '😰 Psicológica' },
                                            { value: 'SEXUAL', label: '⚠️ Sexual' }, { value: 'ECONOMICA', label: '💰 Económica' },
                                            { value: 'PATRIMONIAL', label: '🏠 Patrimonial' }
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Sexual Violence + NNA Alert */}
                            {esSexual && esNNA && !data.caso.hay_nna_victima_sexual_en_familia && (
                                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                            <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-red-800">🚨 VIOLENCIA SEXUAL CONTRA NNA — NO COMPETENCIA</p>
                                            <p className="text-xs text-red-700 mt-1">
                                                Según la Ley 1098/2006 y Ley 2126/2021, la competencia exclusiva es del Defensor de Familia (ICBF).
                                                El sistema generará Auto de Remisión. Sin embargo, puede dictar medida provisional urgente si hay riesgo inminente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Relato de los Hechos *</Label>
                                <Textarea
                                    value={data.caso.hechos_relato}
                                    onChange={e => updateField('caso', 'hechos_relato', e.target.value)}
                                    placeholder="Describa tiempo, modo y lugar de la agresión. Sea lo más detallado posible..."
                                    className="min-h-[150px]"
                                />
                                <p className="text-xs text-slate-400">{data.caso.hechos_relato.length}/20 caracteres mínimos</p>
                            </div>

                            {/* Competence Questions */}
                            <div className="p-4 bg-slate-100 border border-indigo-200 rounded-xl space-y-3">
                                <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                                    <Scale className="h-4 w-4" /> Verificación de Competencia (Art. 5, Ley 2126/2021)
                                </h4>
                                <div className="space-y-2.5">
                                    <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:bg-slate-100/50 transition-colors">
                                        <input type="checkbox" checked={data.caso.ambito === 'FAMILIAR'} onChange={e => updateField('caso', 'ambito', e.target.checked ? 'FAMILIAR' : 'NO_FAMILIAR')}
                                            className="h-4 w-4 mt-0.5 rounded border-indigo-300 text-slate-700 focus:ring-indigo-400" />
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">¿Es violencia en contexto familiar?</span>
                                            <p className="text-xs text-slate-400">El agresor es miembro del núcleo familiar o persona con quien se tiene/tuvo relación sentimental</p>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:bg-slate-100/50 transition-colors">
                                        <input type="checkbox" checked={data.caso.hechos_lugar_municipio} onChange={e => updateField('caso', 'hechos_lugar_municipio', e.target.checked)}
                                            className="h-4 w-4 mt-0.5 rounded border-indigo-300 text-slate-700 focus:ring-indigo-400" />
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">¿Los hechos ocurrieron en este municipio?</span>
                                            <p className="text-xs text-slate-400">Competencia territorial según Art. 8</p>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3 p-2.5 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:bg-slate-100/50 transition-colors">
                                        <input type="checkbox" checked={data.caso.victima_domicilio_municipio} onChange={e => updateField('caso', 'victima_domicilio_municipio', e.target.checked)}
                                            className="h-4 w-4 mt-0.5 rounded border-indigo-300 text-slate-700 focus:ring-indigo-400" />
                                        <div>
                                            <span className="text-sm font-medium text-slate-700">¿La víctima tiene domicilio en este municipio?</span>
                                            <p className="text-xs text-slate-400">Competencia territorial alternativa</p>
                                        </div>
                                    </label>

                                    {/* Concurrencia checkbox — only show when relevant */}
                                    {(esNNA && esSexual) || (!esNNA && data.caso.ambito === 'FAMILIAR') ? (
                                        <label className="flex items-start gap-3 p-2.5 bg-amber-50 rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-100/50 transition-colors">
                                            <input type="checkbox" checked={data.caso.hay_nna_victima_sexual_en_familia}
                                                onChange={e => updateField('caso', 'hay_nna_victima_sexual_en_familia', e.target.checked)}
                                                className="h-4 w-4 mt-0.5 rounded border-amber-400 text-amber-600 focus:ring-amber-400" />
                                            <div>
                                                <span className="text-sm font-medium text-amber-800">¿Hay un NNA víctima de violencia sexual en la misma familia?</span>
                                                <p className="text-xs text-amber-600">Regla de Concurrencia — Si aplica, el Comisario asume todo el caso (unidad procesal)</p>
                                            </div>
                                        </label>
                                    ) : null}
                                </div>
                            </div>

                            {/* Real-time Competence Result */}
                            {competenciaResult && (
                                <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${competenciaResult.es_competente
                                    ? 'bg-emerald-50 border-emerald-300'
                                    : competenciaResult.competencia_subsidiaria
                                        ? 'bg-amber-50 border-amber-300'
                                        : 'bg-red-50 border-red-300'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${competenciaResult.es_competente ? 'bg-emerald-100' :
                                            competenciaResult.competencia_subsidiaria ? 'bg-amber-100' : 'bg-red-100'
                                            }`}>
                                            {competenciaResult.es_competente ?
                                                <Shield className="h-5 w-5 text-emerald-600" /> :
                                                <ShieldAlert className="h-5 w-5 text-red-600" />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-bold ${competenciaResult.es_competente ? 'text-emerald-800' :
                                                competenciaResult.competencia_subsidiaria ? 'text-amber-800' : 'text-red-800'
                                                }`}>
                                                {competenciaResult.es_competente ? '✅ COMPETENCIA VERIFICADA' :
                                                    competenciaResult.competencia_subsidiaria ? '⚠️ COMPETENCIA SUBSIDIARIA' :
                                                        '⛔ NO ES COMPETENCIA'}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1">{competenciaResult.mensaje}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-mono">{competenciaResult.fundamento_legal}</p>
                                            {competenciaResult.entidad_remision && (
                                                <p className="text-xs font-semibold text-slate-700 mt-2">
                                                    Remitir a: <span className="text-red-600">{competenciaResult.entidad_remision}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {competenciaResult.alertas.length > 0 && (
                                        <div className="mt-3 space-y-1 pl-12">
                                            {competenciaResult.alertas.map((alerta, i) => (
                                                <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                                                    <span className="text-amber-500 flex-shrink-0">•</span> {alerta}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ================ PASO 4: CONFIRMACIÓN ================ */}
                    {step === 4 && competenciaResult && (
                        <div className="space-y-6">
                            {/* Competence Result Banner */}
                            <div className={`p-5 rounded-xl border-2 ${competenciaResult.es_competente ? 'bg-emerald-50 border-emerald-300' :
                                competenciaResult.competencia_subsidiaria ? 'bg-amber-50 border-amber-300' :
                                    'bg-red-50 border-red-300'
                                }`}>
                                <h3 className={`text-lg font-bold flex items-center gap-2 ${competenciaResult.es_competente ? 'text-emerald-800' : 'text-red-800'
                                    }`}>
                                    {competenciaResult.es_competente ? (
                                        <><CheckCircle2 className="h-6 w-6" /> COMPETENCIA VERIFICADA</>
                                    ) : (
                                        <><X className="h-6 w-6" /> NO ES COMPETENCIA DEL COMISARIO</>
                                    )}
                                </h3>
                                <p className="mt-2 text-sm text-slate-700">{competenciaResult.mensaje}</p>
                                <p className="mt-1 text-xs text-slate-500 font-mono">{competenciaResult.fundamento_legal}</p>
                                {competenciaResult.entidad_remision && (
                                    <div className="mt-3 p-3 bg-white rounded-lg border">
                                        <p className="text-sm font-bold text-slate-700">
                                            📤 Remitir a: <span className="text-red-600">{competenciaResult.entidad_remision}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Case Summary */}
                            {competenciaResult.es_competente && (
                                <div className="bg-white border rounded-xl divide-y">
                                    <div className="p-4">
                                        <h4 className="text-sm font-bold text-slate-700 mb-3">📋 Resumen del Caso</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-slate-400 text-xs">Víctima</span>
                                                <p className="font-medium text-slate-800">{data.victima.nombres}</p>
                                                <p className="text-xs text-slate-500">{data.victima.tipo_documento} {data.victima.documento}</p>
                                                <p className="text-xs text-slate-500">{edadVictima} años — {esNNA ? 'NNA' : 'Adulto'}</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs">Agresor</span>
                                                <p className="font-medium text-slate-800">{data.agresor.nombres}</p>
                                                <p className="text-xs text-slate-500">Parentesco: {PARENTESCOS.find(p => p.value === data.agresor.parentesco)?.label}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <span className="text-slate-400 text-xs">Tipología</span>
                                                <p className="font-medium text-slate-800">{data.caso.tipologia}</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs">Ámbito</span>
                                                <p className="font-medium text-slate-800">{data.caso.ambito === 'FAMILIAR' ? 'Familiar' : 'No Familiar'}</p>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs">Regla</span>
                                                <p className="font-medium text-slate-800">{competenciaResult.regla_aplicada}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <span className="text-slate-400 text-xs">Relato</span>
                                        <p className="text-sm text-slate-700 mt-1 line-clamp-3">{data.caso.hechos_relato}</p>
                                    </div>
                                    {data.victima.grupo_etnico && data.victima.grupo_etnico !== 'NINGUNO' && (
                                        <div className="p-4 bg-amber-50">
                                            <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                Enfoque diferencial activo: {data.victima.grupo_etnico}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Auto de Remisión (when NOT competent) */}
                            {competenciaResult.requiere_auto_remision && (
                                <div className="space-y-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAutoRemision(!showAutoRemision)}
                                        className="w-full border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        {showAutoRemision ? 'Ocultar' : 'Ver'} Auto de Remisión Generado
                                    </Button>
                                    {showAutoRemision && (
                                        <div className="p-4 bg-white border rounded-lg font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-80 overflow-y-auto">
                                            {generarAutoRemision(competenciaResult, {
                                                victima: data.victima.nombres,
                                                tipologia: data.caso.tipologia,
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Medida Provisional Urgente (when competence is subsidiary or allows it) */}
                            {!competenciaResult.es_competente && competenciaResult.permite_medida_provisional && (
                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                                        <Gavel className="h-4 w-4" /> Medida Provisional Urgente
                                    </h4>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Aunque el caso será remitido, si hay riesgo inminente puede dictar una medida provisional antes de cerrar.
                                    </p>
                                    <Button
                                        type="button"
                                        className="mt-3 bg-amber-600 hover:bg-amber-700 text-sm gap-2"
                                        onClick={() => {
                                            alert('Funcionalidad de medida provisional urgente — se registrará como actuación y se generará el auto correspondiente antes de la remisión.')
                                        }}
                                    >
                                        <Gavel className="h-4 w-4" /> Dictar Medida Provisional
                                    </Button>
                                </div>
                            )}

                            {/* Alertas */}
                            {competenciaResult.alertas.length > 0 && (
                                <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
                                    <h4 className="text-sm font-bold text-slate-700">📌 Alertas del Sistema</h4>
                                    {competenciaResult.alertas.map((a, i) => (
                                        <p key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                            <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" /> {a}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* FOOTER WITH NAVIGATION */}
                <CardFooter className="flex justify-between bg-slate-50 px-6 py-4 border-t">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack} className="gap-2">
                            <ChevronLeft className="h-4 w-4" /> Atrás
                        </Button>
                    ) : <div />}

                    <div className="flex gap-3">
                        {step < 4 && (
                            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-md shadow-blue-200">
                                Siguiente <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}

                        {step === 4 && competenciaResult?.es_competente && (
                            <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-lg shadow-emerald-200">
                                {loading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Radicando...</>
                                ) : (
                                    <><Gavel className="h-4 w-4" /> Confirmar y Generar Radicado</>
                                )}
                            </Button>
                        )}

                        {step === 4 && !competenciaResult?.es_competente && (
                            <Button
                                onClick={() => {
                                    alert('Se registrará la remisión y se generará el auto correspondiente.')
                                }}
                                className="bg-red-600 hover:bg-red-700 gap-2"
                            >
                                <ArrowRight className="h-4 w-4" /> Generar Remisión y Cerrar
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>

            {/* ══════ SUCCESS / ERROR MODAL ══════ */}
            {modalState.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => {
                            if (modalState.type === 'error') setModalState({ ...modalState, open: false });
                        }}
                    />

                    {/* Modal Card */}
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        {/* Top accent */}
                        <div className={`h-1.5 w-full ${modalState.type === 'success'
                            ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-red-400 via-red-500 to-rose-500'
                            }`} />

                        <div className="px-8 pt-8 pb-6 text-center">
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 ${modalState.type === 'success'
                                ? 'bg-emerald-50 border-2 border-emerald-200'
                                : 'bg-red-50 border-2 border-red-200'
                                }`}>
                                {modalState.type === 'success' ? (
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                ) : (
                                    <AlertTriangle className="h-8 w-8 text-red-500" />
                                )}
                            </div>

                            {/* Title */}
                            <h2 className={`text-xl font-bold tracking-tight mb-2 ${modalState.type === 'success' ? 'text-slate-900' : 'text-red-800'
                                }`}>
                                {modalState.type === 'success'
                                    ? 'Caso Radicado Exitosamente'
                                    : 'Error al Radicar'
                                }
                            </h2>

                            {modalState.type === 'success' ? (
                                <>
                                    <p className="text-sm text-slate-500 mb-5">
                                        El caso ha sido registrado en el sistema con el siguiente número de radicado:
                                    </p>

                                    {/* Radicado Number */}
                                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl px-6 py-4 mb-5">
                                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                                            Número de Radicado
                                        </p>
                                        <p className="text-2xl font-bold font-mono text-emerald-700 tracking-wide">
                                            {modalState.radicado}
                                        </p>
                                    </div>

                                    {/* Case summary mini */}
                                    <div className="bg-slate-50 rounded-xl p-4 mb-5 text-left space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Víctima</span>
                                            <span className="font-medium text-slate-700">{data.victima.nombres}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Tipología</span>
                                            <span className="font-medium text-slate-700">{data.caso.tipologia}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Ámbito</span>
                                            <span className="font-medium text-slate-700">{data.caso.ambito === 'FAMILIAR' ? 'Familiar' : 'No Familiar'}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2.5">
                                        <Button
                                            onClick={() => window.location.href = `/dashboard/casos/${modalState.radicado}`}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 shadow-lg shadow-emerald-200 py-3"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Ver Expediente del Caso
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => window.location.href = '/dashboard/recepcion'}
                                            className="w-full gap-2 py-3"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                            Volver a Recepción
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                                        {modalState.message}
                                    </p>
                                    <Button
                                        onClick={() => setModalState({ ...modalState, open: false })}
                                        variant="outline"
                                        className="w-full gap-2 border-red-200 text-red-700 hover:bg-red-50 py-3"
                                    >
                                        <X className="h-4 w-4" />
                                        Cerrar e Intentar de Nuevo
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
