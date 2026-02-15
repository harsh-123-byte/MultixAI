// Ye component hum log bana rhe hain to showw all aur recent creations on the dashboard.

import React, { useState } from 'react'
import Markdown from 'react-markdown'

const CreationItem = ({item}) => {

    const [expanded, setExpanded] = useState(false) // By default the list item is collapsed, after clicking on it it will get expanded.

  return (
    // !expanded isliye laga rhe hain kyuki agar pahele se expanded hai to collapse ho jayega aur collapsed hai to expand ho jayega.
    <div onClick={()=> setExpanded(!expanded)} className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer'>
        <div className='flex justify-between items-center gap-4'>
            <div>
                {/* Har ek list item ke neeche type show hoga aur right corner pe bhi wahi cheez show hogi. */}
                <h2>{item.prompt}</h2>
                <p className='text-gray-500'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p> {/* Kis date pe hum ne kya create kiya hai uske liye. */}
            </div>
            <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full'>{item.type}</button>
        </div>
        {
            expanded && (
                <div>
                    {item.type === 'image' ? (
                        <div>
                            <img src={item.content} alt="image" className='mt-3 w-full max-w-md'/>
                        </div>
                    ) : ( // agar jispe click kiye ho wo image item nhi hai to.
                        <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                            <div className='reset-tw'> {/* Tailwind ke default styles ko reset / neutralize karna, taaki Markdown ka content sahi dikhe. */}
                                <Markdown>{item.content}</Markdown> {/* Structured way me respnse ko lane ke liye use kiye hain. */}
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    </div>
  )
}

export default CreationItem
