import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Checkbox } from './ui/checkbox'

const filterData = [
    {
        filterType: "Location",
        array: ["Karachi", "Lahore", "Multan", "Islamabad", "Hyderabad"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "App Developer", "Data Scientist", "Cybersecurity", "DevOps"]
    }
]

const FilterCard = () => {
    const [selectedValues, setSelectedValues] = useState([])  // store multiple selected filters
    const dispatch = useDispatch()

    const changeHandler = (item) => {
        setSelectedValues((prev) =>
            prev.includes(item)
                ? prev.filter((val) => val !== item) // remove if already selected
                : [...prev, item] // add if not selected
        )
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValues))
    }, [selectedValues, dispatch])

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            {
                filterData.map((data, index) => (
                    <div key={index}>
                        <h1 className='font-bold text-lg mt-4'>{data.filterType}</h1>
                        {
                            data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`
                                return (
                                    <div key={itemId} className='flex items-center space-x-2 my-2'>
                                        <Checkbox
                                            id={itemId}
                                            checked={selectedValues.includes(item)}
                                            onCheckedChange={() => changeHandler(item)}
                                        />
                                        <Label htmlFor={itemId}>{item}</Label>
                                    </div>
                                )
                            })
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default FilterCard
