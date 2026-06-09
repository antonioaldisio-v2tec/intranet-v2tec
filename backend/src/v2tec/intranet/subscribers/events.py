from v2tec.intranet import logger


def log_object_event(event) -> None:
    """Registra no console todos os eventos de objeto disparados no portal."""
    obj = event.object
    portal_type = getattr(obj, "portal_type", type(obj).__name__)
    obj_id = getattr(obj, "getId", lambda: repr(obj))()
    logger.info(
        "Evento: %s | objeto: %s (%s)",
        event.__class__.__name__,
        obj_id,
        portal_type,
    )
