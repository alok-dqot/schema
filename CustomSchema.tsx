import { FormControl, TextField, FormHelperText, Button, FormControlLabel, Switch, TextFieldProps, Autocomplete, Checkbox } from "@mui/material";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import * as yup from 'yup';
import Grid from '@mui/system/Grid';
import React, { JSX, useEffect, useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';

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


interface SchemaFormProps {
    describedSchema: any;
    defaultValues?: Record<string, any>;
    onSubmit: SubmitHandler<any>;
    isDialog?: boolean
    gx?: number;
    title?: string;
    handleClose: () => void;
    schema: any;
}




const CustomSchema: React.FC<SchemaFormProps> = ({ describedSchema, onSubmit, defaultValues, isDialog, gx, title, handleClose, schema }) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });



    const is_partner = useWatch({ control, name: "is_partner" });

    useEffect(() => {
        if (is_partner == undefined) return
        describedSchema.fields['partner_company_id'].meta.hidden = is_partner;
    }, [is_partner])


    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px' }}>
                <Grid container spacing={6} sx={{ justifyContent: 'flex-start' }} key={title}>
                    {Object.keys(describedSchema?.fields).map(fieldName => {
                        const field = describedSchema.fields[fieldName] as yup.SchemaDescription & { meta: any }
                        if (field?.meta?.hidden) {
                            return <></>
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
                            <Grid size={gx || field?.meta?.sm || 6} key={fieldName}>
                                <FormControl fullWidth>
                                    <Controller
                                        name={fieldName as any}
                                        control={control}
                                        rules={{ required: true }}
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
                                                                field.oneOf.find((f: any) => f.value == value) || null
                                                            }
                                                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => {
                                                                return <TextField {...params} label={label} size="small"
                                                                    onChange={(e: any) => {
                                                                        field.meta?.onSearch(e.target.value)
                                                                    }}
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


                                            if (type === "colorpicker") {
                                                return (
                                                    <CustomColorComp
                                                        fieldName={fieldName}
                                                        label={label}
                                                        setValue={setValue}
                                                        value={value}
                                                    />
                                                )
                                            }

                                            if (type == 'multiselect') {
                                                return (
                                                    <MutliSelect
                                                        list={[...field.meta?.values]}
                                                        label={label}
                                                        onChange={(values: any) => {
                                                            // console.log(values)
                                                            setValue(fieldName as any, values)
                                                        }}

                                                    />
                                                )
                                            }

                                            if (type === 'switch') {
                                                // console.log(value)
                                                return (
                                                    <FormControlLabel required control={<Switch
                                                        checked={value}
                                                        onChange={e => {
                                                            setValue(fieldName as any, e.target.checked)
                                                        }}
                                                        aria-label={label}

                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />} label={field?.label} />


                                                )
                                            }


                                            if (type === 'questions') {
                                                return (
                                                    <QAForm
                                                        setValue={setValue}
                                                        fieldName="questionnaire_fields"
                                                        control1={control}
                                                        value={value}
                                                    />


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

                                                    size="small"
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
                        {!isDialog &&
                            <Button variant='contained' type="submit" className="btn-primary">
                                Submit
                            </Button>
                        }
                        <Button variant='outlined' color="inherit" type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                    </div>


                </Grid >
            </form >
        </>
    )
}


export default CustomSchema;







const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MutliSelect = ({ list, value, onChange, label }: any) => {
    return (
        <>
            <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={list}
                disableCloseOnSelect
                // value={value}
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
                style={{ maxWidth: 500 }}
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


