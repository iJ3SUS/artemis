export const url = '/dashboard/disabilities/:_id/cancel'

import Disability from "#app/disabilities/models/Disability.js"

export const controller = async (req, rep) => {

    const { _id } = req.params
    const { body, user } = req

    const disability = await Disability.query()
        .match({ _id: _id })
        .first()

    if (!disability) {
        return rep.status(404).send({
            message: 'Incapacidad no encontrada'
        })
    }

    if (disability.status?.stage === 2) {
        return rep.status(400).send({
            message: 'No se puede cancelar una incapacidad que ya fue pagada'
        })
    }

    if (disability.status?.stage === 3) {
        return rep.status(400).send({
            message: 'Esta incapacidad ya fue cancelada'
        })
    }

    const status = {
        _id: disability.uuid(),
        date: new Date(),
        stage: 3,
        user: {
            _id: user._id,
            display_name: user.display_name,
        },
        observation: body.observation || '',
    }

    disability.status = status

    disability.timeline.push(status)

    const response = await disability.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import CancelSchema from "#app/disabilities/schemas/cancel.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(CancelSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('disabilities.update')
        .on('pre-handler'),
]
