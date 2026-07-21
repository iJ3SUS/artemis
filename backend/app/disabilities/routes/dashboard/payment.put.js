export const url = '/dashboard/disabilities/:_id/payment'

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
            message: 'Esta incapacidad ya fue pagada'
        })
    }

    disability.days_paid = body.days_paid
    disability.amount = body.amount
    disability.paid_at = body.paid_at

    const status = {
        _id: disability.uuid(),
        date: new Date(),
        stage: 2,
        user: {
            _id: user._id,
            display_name: user.display_name,
        },
        observation: body.observations || '',
    }

    disability.status = status

    disability.timeline.push(status)

    const response = await disability.save()

    return rep.send(response)

}

import { AuthMiddleware, ParseOidMiddleware, ValidateMiddleware, CanMiddleware } from "#src/middlewares/index.js"
import PaymentSchema from "#app/disabilities/schemas/payment.js"

export const middlewares = [
    new AuthMiddleware()
        .message("Debes estar autenticado para acceder a este recurso"),

    new ParseOidMiddleware()
        .on('_id'),

    new ValidateMiddleware()
        .on('pre-handler')
        .schema(PaymentSchema)
        .message("Hay errores en el formulario. Revisa los campos marcados e inténtalo de nuevo."),

    new CanMiddleware('disabilities.update')
        .on('pre-handler'),
]
