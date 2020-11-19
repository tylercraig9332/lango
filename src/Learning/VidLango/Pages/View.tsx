import { message } from 'antd'
import React, { useEffect, useState } from 'react'
import Loading from '../../../Util/Loading'
import SubtitleViewer from '../Player/Components/SubtitleViewer'
import InteractivePlayer from '../Player/YoutubePlayer'
import IVidLango from '../VidLango'
//import VideoPlayer from './VideoPlayer'

export default function View(props : {vidLango : IVidLango | undefined, preview?: boolean}) {

    const [vidLango, setVidLango] = useState<IVidLango>()
    
    useEffect(() => {
        if (props.vidLango === undefined) {
            // TODO: handle error or load from url
            const urls = window.location.pathname.split('/')
            const id = urls[3]
            fetch('/l/vid/' + id).then(res => {
                if (res.status !== 200) {
                    message.error(res.statusText)
                    return
                }
                return res.json()
            }).then(data => {
                const v : IVidLango = data[0]
                // Allows for the WordLearner to identify the language
                window.sessionStorage.setItem('LangoLanguage', v.language)
                setVidLango(v)
            })
        } else {
            setVidLango(props.vidLango)
        }
    }, [])

    /**
     * Allows for sub-components to update the caption state and then save the new captions to the server
     * @param captions new captions to be passed back up to be saved into the state and the db
     */
    function captionChange(captions : Array<any>) {
        if (vidLango === undefined) return // This should never be the case as the funciton can only be called if it's defined, but TypeScript
        const v = {...vidLango, captions: [...vidLango.captions, captions]}
        const reqHeaders = {
            body: JSON.stringify(v),
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT"
        }
        fetch('/l/vid/' + vidLango._id, reqHeaders).then(res => {
            if (res.status === 200) message.success('VidLango Updated!')
        })
        setVidLango(v)
    }

    if (vidLango === undefined) return <Loading message="Loading VidLango..." />
    return (
        <div>
            { (props.preview) ?
                <h3>{vidLango.meta?.title}</h3> :
                <h1>{vidLango.meta?.title}</h1>
            }
            <hr></hr>
            <div style={videoStyleWrap}>
                <InteractivePlayer video_id={vidLango.video_id} captions={vidLango.captions} onCaptionChange={captionChange} preview={props.preview} />
            </div>
        </div>
    )
}

const videoStyleWrap = {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto'
} as React.CSSProperties