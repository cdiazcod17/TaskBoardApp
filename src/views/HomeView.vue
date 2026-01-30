<template>
    <div>
        <p>Email: {{ usuario?.email }}</p>
        <p>UID: {{ usuario?.uid }}</p>
        <p>Email verificado: {{ usuario?.emailVerified ? 'Sí' : 'No' }}</p>
    </div>
</template>

<script setup>

import { obtenerUsuario } from '@/servicios/autentication';
const usuario = obtenerUsuario()

</script>

<style lang="scss" scoped></style>