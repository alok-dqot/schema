import { FormControl, TextField, FormHelperText, Button, FormControlLabel, Switch, TextFieldProps, Autocomplete, Checkbox, Box, Select, MenuItem, Card, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Controller, ErrorOption, FieldArray, FieldArrayPath, FieldError, FieldErrors, FieldName, FieldValues, FormState, InternalFieldName, ReadFormState, RegisterOptions, SubmitErrorHandler, SubmitHandler, useForm, UseFormRegisterReturn, useWatch } from "react-hook-form";
import * as yup from 'yup';
import Grid from '@mui/system/Grid';
import React, { JSX, useEffect, useState } from "react";
import DateTimeYearPicker from '../picker/DateTimeYearPicker';

import { inputType } from '../../context/types';
import { yupResolver } from "@hookform/resolvers/yup";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { format } from "date-fns";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import '../../styles/schema.scss';
import QAForm from "./QAComp";
import { languages } from "../sidebar/AppBar";
// import useUserStore from "../../features/users/user.service";
import { getUser } from "../../helpers/common";
import GeoMapContainer from "../geofence/geo.map.container";
import SchemaToForm from "./SchemaToForm";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MapWithPin from "../geofence/google.map.container";
import MapWithPolygon from "../geofence/google.map.container";


interface SchemaFormProps {
    defaultValues?: Record<string, any>;
    onSubmit: SubmitHandler<any>;
    isDialog?: boolean
    title?: string;
    handleClose: () => void;
    schema: any;
    isView?: boolean;
}




const CustomSchema: React.FC<SchemaFormProps> = ({ onSubmit, defaultValues, isDialog, title, handleClose, schema, isView: isViewMode = false }) => {
    const { control, handleSubmit, formState: { errors }, setValue, reset, trigger, getValues } = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });


    // console.log(defaultValues)
    const [describedSchema, setDescribedSchema] = useState(() => schema.describe());

    const is_partner = useWatch({ control, name: "is_partner" });
    const is_circular = useWatch({ control, name: "is_circular" });
    const role_id = useWatch({ control, name: "role_id" });

    useEffect(() => {
        if (role_id === undefined) return;

        const updatedSchema = schema.describe();
        if (role_id === 3 || role_id === 5 || role_id === 6) {
            updatedSchema.fields['enable_watch_activation'].meta.hidden = false;
        } else {
            updatedSchema.fields['enable_watch_activation'].meta.hidden = true;
        }
        setDescribedSchema(updatedSchema);
    }, [role_id]);

    useEffect(() => {
        if (is_partner == undefined) return
        describedSchema.fields['partner_company_id'].meta.hidden = is_partner;
    }, [is_partner])

    const [formKey, setFormKey] = useState(0)


    async function formSubmit(e: React.FormEvent) {
        e.preventDefault();

        const isValid = await trigger();
        if (!isValid) return;

        const values = getValues();
        const result = await onSubmit(values) as any;

        if (result) {
            reset(defaultValues)
            setFormKey(formKey + 1)
            setDescribedSchema(schema.describe())

        }


    }

    if (!defaultValues) return <h2 style={{ textAlign: 'center' }}>Loading...</h2>
    return (
        <>

            <form onSubmit={formSubmit} style={{ marginTop: '20px' }} key={formKey}>
                <Grid container spacing={6} sx={{ justifyContent: 'flex-start' }} key={title}>
                    {Object.keys(describedSchema?.fields).map(fieldName => {
                        const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
                        if (field?.meta?.hidden) {
                            return <></>
                        }

                        if (fieldName == 'company_id') {
                            const user = getUser() as any
                            if (user.role_name !== "Super Admin") {
                                return <>
                                </>
                            }
                        }

                        let label = field.label
                        if (!label) {
                            label = fieldName.replaceAll('_', ' ')
                            label = label.charAt(0).toUpperCase() + label.slice(1)
                        }
                        let type = field.meta?.type || inputType[field.type];

                        if (field.meta?.type == 'select') {
                            field.oneOf = field.meta?.values || ['Select']
                        }


                        if (field.type == 'boolean') {
                            field.oneOf = [
                                {
                                    value: 1,
                                    label: 'YES'
                                },
                                {
                                    value: 0,
                                    label: 'NO'
                                }
                            ]
                        }




                        return (
                            <Grid size={{ xs: 12, md: field?.meta?.md || 6, lg: field?.meta?.sm || 4 }} key={fieldName}>
                                <FormControl fullWidth>
                                    <Controller
                                        name={fieldName as any}
                                        control={control}
                                        rules={{ required: true }}
                                        disabled={isViewMode}
                                        render={({ field: { value, onChange } }) => {

                                            // if (type == 'file') {
                                            //     return (
                                            //         <>
                                            //             <Button variant='outlined' fullWidth size='medium' color='primary'>
                                            //                 <label
                                            //                     htmlFor={`user-view-${title}-${fieldName}`}
                                            //                     style={{
                                            //                         width: '100%',
                                            //                         height: '100%',
                                            //                         display: 'flex',
                                            //                         justifyContent: 'start',
                                            //                         alignItems: 'center',
                                            //                         cursor: 'pointer'
                                            //                     }}
                                            //                 >
                                            //                     <UploadFileIcon />
                                            //                     <p
                                            //                         style={{
                                            //                             textOverflow: 'ellipsis',
                                            //                             overflow: 'hidden',
                                            //                             whiteSpace: 'nowrap',
                                            //                             margin: '0 0 0 5px'
                                            //                         }}
                                            //                     >
                                            //                         {value?.name || label}
                                            //                     </p>
                                            //                 </label>
                                            //             </Button>

                                            //             <input
                                            //                 type='file'
                                            //                 id={`user-view-${title}-${fieldName}`}
                                            //                 hidden
                                            //                 onChange={e => {
                                            //                     let file = e.target.files?.[0]
                                            //                     if (file) {
                                            //                         setValue(fieldName as any, file)

                                            //                     }
                                            //                 }}
                                            //                 {...field?.meta?.attr}
                                            //             />
                                            //         </>
                                            //     )
                                            // }

                                            if (type == 'switch') {

                                                return (
                                                    <FormControlLabel control={<Switch
                                                        checked={value}
                                                        onChange={e => {
                                                            setValue(fieldName as any, e.target.checked)
                                                        }}
                                                        inputProps={{ 'aria-label': 'controlled' }}

                                                    />} label={field?.label} />


                                                )
                                            }


                                            try {
                                                if (type == 'select') {
                                                    return (
                                                        <Autocomplete
                                                            options={[...field.oneOf]}
                                                            onChange={(e, value: any) => {
                                                                // console.log(value)
                                                                setValue(
                                                                    fieldName as any,
                                                                    (typeof value === 'object' ? value?.value : value) as any
                                                                )

                                                                if (field?.meta?.onChange) {
                                                                    field?.meta?.onChange(value?.value)
                                                                }
                                                            }}
                                                            getOptionLabel={(option: any) =>
                                                                typeof option == 'object' ? option.label : option
                                                            }
                                                            value={
                                                                field.oneOf.find((f: any) => f.value == value) || value
                                                            }
                                                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => {
                                                                return <TextField {...params} label={label} size="small"
                                                                    onChange={(e: any) => {
                                                                        field.meta?.onSearch(e.target.value)
                                                                    }}
                                                                // sx={{ maxWidth: '380px' }}
                                                                />
                                                            }}
                                                            disabled={field.meta.disable || false}
                                                        />
                                                    )
                                                }
                                            } catch (e) {
                                                console.error(fieldName)
                                                return <></>
                                            }

                                            if (type === 'datetime-local' || type == 'date') {
                                                return (
                                                    <DateTimeYearPicker
                                                        label={label}
                                                        value={value}
                                                        onChange={(date: Date) => {
                                                            setValue(fieldName as any, format(new Date(date), 'yyyy-MM-dd HH:mm:ss'))
                                                        }}
                                                    />
                                                )
                                            }


                                            // if (type === "colorpicker") {
                                            //     return (
                                            //         <CustomColorComp
                                            //             fieldName={fieldName}
                                            //             label={label}
                                            //             setValue={setValue}
                                            //             value={value}
                                            //         />
                                            //     )
                                            // }

                                            if (type == 'multiselect') {
                                                return (
                                                    <MutliSelect
                                                        list={[...field.meta?.values]}
                                                        label={label}
                                                        onChange={(values: any) => {
                                                            setValue(fieldName as any, values)
                                                        }}
                                                        value={value}

                                                    />
                                                )
                                            }




                                            if (type === 'questions') {
                                                return (
                                                    <QAForm
                                                        setValue={setValue}
                                                        fieldName="questionnaire_fields"
                                                        defaultValues={value && { questions: [...value] }}
                                                    />


                                                )
                                            }


                                            if (type === 'header') {
                                                return (
                                                    <>
                                                        <NewFormHeader
                                                            title={field.meta?.title as any}
                                                            control={control}
                                                            schemas={field.meta?.schemas}
                                                            setValue={setValue}
                                                            errors={errors}

                                                        />
                                                    </>
                                                )
                                            }


                                            if (type === 'mobile') {
                                                const [countryCode, setCountryCode] = useState('+91');
                                                return (
                                                    <Box display="flex" alignItems="center" gap={0.2}>
                                                        <Select
                                                            size="small"
                                                            value={countryCode}
                                                            onChange={(e) => setCountryCode(e.target.value)}
                                                            disabled={field.meta?.disable || false}
                                                            sx={{ minWidth: 80, }}
                                                        >
                                                            {languages.map((c) => (
                                                                <MenuItem key={c.code} value={c.dialCode} sx={{ fontSize: '11px' }}>
                                                                    {c.dialCode}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>

                                                        <TextField
                                                            size="small"
                                                            label={label}
                                                            value={value}
                                                            type="number"

                                                            onChange={(e) => {
                                                                setValue(fieldName as any, e.target.value);
                                                            }}
                                                            disabled={field.meta?.disable || false}
                                                            fullWidth
                                                        />
                                                    </Box>
                                                )
                                            }

                                            if (type == 'geomap') {
                                                return (
                                                    <>
                                                        <MapWithPolygon
                                                            setValue={setValue}
                                                            control={control}
                                                            schema={field.meta?.schemas}
                                                            is_circular={is_circular}
                                                            errors={errors}
                                                            value={value}
                                                            isViewMode={isViewMode}
                                                            key={field.meta?.schemas ? 'asdf' : 'asdf'}
                                                        // key={is_circular ? 'new1' : 'is_circular'}
                                                        />

                                                    </>
                                                )
                                            }

                                            return (
                                                <TextField
                                                    value={value}
                                                    label={label}
                                                    onChange={e => {
                                                        setValue(fieldName as any, e.target.value)

                                                    }}
                                                    // defaultValue={values}
                                                    type={type}
                                                    disabled={field.meta?.disable || false}
                                                    required={field?.tests.length > 0 && field?.tests.find((r: any) => r.name == "required") as any || false}
                                                    size="small"
                                                    autoComplete="off"
                                                />
                                            )
                                        }}
                                    />
                                    {(errors as any)[fieldName] && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-first-name'>
                                            {(errors as any)[fieldName]?.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                            </Grid>
                        )
                    })}
                    <div className="cstm-schema-btn">
                        {!isViewMode &&
                            <>
                                <Button variant='contained' type="submit" className="btn-primary">
                                    Save
                                </Button>
                                <Button variant='outlined' color="inherit" type="button" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </>

                        }

                    </div>


                </Grid >
            </form >
        </>
    )
}


export default CustomSchema;







const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const MutliSelect = ({ list, value, onChange, label }: any) => {
    return (
        <>
            <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={list}
                disableCloseOnSelect
                value={value}
                getOptionLabel={(option: any) => option.label}
                onChange={(e: any, value: any) => {
                    onChange(value)
                }}
                renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                        <li key={key} {...optionProps}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option.label}
                        </li>
                    );
                }}
                style={{ maxWidth: 500, minWidth: '100%' }}
                renderInput={(params) => (
                    <TextField {...params} label={label} size="small" />
                )}
            />
        </>
    )
}






const CustomColorComp = ({ fieldName, setValue, label, value }: any) => {
    const [color, setColor] = useColor(value || '')
    return (

        <>
            <h4>{label}</h4>

            <ColorPicker color={color}
                hideInput={["rgb", "hsv"]}
                onChange={(clr: any) => {
                    setColor(clr)
                    // console.log(clr)
                    setValue(fieldName, clr.hex)

                }} />

        </>
    )
}







const NewFormHeader = ({ title, schemas, control, errors, setValue }: any) => {
    // console.log(schemas)


    const [toggleHeader, setToggleHeader] = useState(false)

    return (

        <Accordion>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"

            >
                <div className="cs-form" style={{ marginTop: '0px' }} onClick={() => setToggleHeader(!toggleHeader)}>
                    <p >{title}</p>

                </div>
            </AccordionSummary>
            <AccordionDetails>

                <Grid container spacing={6} sx={{ justifyContent: 'flex-start' }} >
                    <SchemaToForm describedSchema={schemas} control={control} setValue={setValue} errors={errors} />
                </Grid>
            </AccordionDetails>
        </Accordion>



    )
}