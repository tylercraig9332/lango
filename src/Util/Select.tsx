import React from 'react'
import { Select } from 'antd'
import language from './language.json'

const { Option } = Select

type SelectProps = {
    value? : string,
    onChange : any,
    type? : string,
    placeholder?: string
}

export function CEFRSelect(props : SelectProps) {
    return (
        <Select
            mode="default"
            onChange={props.onChange}
            style={{width: '100%'}}
            placeholder={(props.placeholder === undefined) ? "Select Difficulty" : props.placeholder}
            value={props.value}
        >
            {
                language.CEFR.map((d : any) => {
                    return (
                        <Option value={d.name} key={d.name}>
                            {d.name} | {d.description}
                        </Option>
                    )
                })
            }
        </Select>
    )
}

export function LanguageSelect(props : SelectProps) {
    return (
        <Select
            mode="default"
            onChange={props.onChange}
            style={{width: '100%', minWidth: 200}}
            placeholder={(props.placeholder === undefined) ? "Select Language" : props.placeholder}
            value={props.value}
        >
            {
                language.info.map(language => {
                    return (
                        <Option value={language.code} key={language.code}>
                            {language.title} 
                            <span role="img" aria-label="China"> {language.flag}</span>
                        </Option>
                    )
                })
            }
        </Select>
    )
}