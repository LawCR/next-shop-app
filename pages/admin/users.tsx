import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { PeopleOutline } from '@mui/icons-material'
import { AdminLayout } from '../../components/layouts'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Grid, MenuItem, Select } from '@mui/material'
import { FullScreenLoading } from '../../components/ui'
import { IUser } from '../../interfaces'
import { tesloApi } from '../../api'


const UsersPage = () => {

    const { data, error} = useSWR<IUser[]>('/api/admin/users')
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (data) setUsers(data)
    }, [data])

    if ( !data && !error) return <FullScreenLoading />

    const onRoleUpdated = async(userId:string, newRole: string) => {
        const previousUsers = [...users]
        const updatedUsers = users.map(user => ({
            ...user,
            role: user._id === userId ? newRole : user.role
        }))

        setUsers(updatedUsers)
        try {
            await tesloApi.put('/admin/users', { userId, role: newRole })
        } catch (error) {
            setUsers(previousUsers)
            console.log(error)
            alert('No se pudo actualizar el rol del usuario')
        }
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre completo', flex: 0.40 },
        { field: 'email', headerName: 'Email', flex: 0.35 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            flex: 0.25,
            renderCell: (params: GridValueGetterParams) => {
                return (
                    <Select
                        value={params.row.role}
                        label='Rol'
                        onChange={(e) => onRoleUpdated(params.row.id, e.target.value)}
                        sx={{width: '100%'}}
                    >
                        <MenuItem value='admin'>Administrador</MenuItem>
                        <MenuItem value='client'>Cliente</MenuItem>
                        <MenuItem value='super-user'>Super User</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                )
            }
        },
    ]

    const rows = users.map( user => ({
        id: user._id,
        email: user.email,
        name: `${user.name} ${user.lastname}`,
        role: user.role
    }))

    return (
        <AdminLayout
            title='Usuarios'
            subTitle='Mantenimiento de usuarios'
            icon={<PeopleOutline />}
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{height: 650, width: '100%', textAlign: 'center'}}>
                    <DataGrid 
                        columns={columns} 
                        rows={rows}           
                        pageSize={10}
                        rowsPerPageOptions={[10]}                
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default UsersPage