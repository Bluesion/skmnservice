package dev.bluesion.mnservice.task1.utils

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object Logger {

    private val dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS")

    enum class LogLevel(val levelName: String) {
        DEBUG("DEBUG"),
        INFO("INFO"),
        WARN("WARN"),
        ERROR("ERROR")
    }

    private fun log(level: LogLevel, message: String, throwable: Throwable? = null) {
        val timestamp = LocalDateTime.now().format(dateTimeFormatter)
        val threadName = Thread.currentThread().name
        val logMessage = "[$timestamp] [${level.levelName}] [$threadName] $message"

        when (level) {
            LogLevel.ERROR, LogLevel.WARN -> System.err.println(logMessage)
            else -> println(logMessage)
        }

        throwable?.printStackTrace(System.err) // Print stack trace to stderr
    }

    fun debug(message: String, throwable: Throwable? = null) {
        log(LogLevel.DEBUG, message, throwable)
    }

    fun info(message: String, throwable: Throwable? = null) {
        log(LogLevel.INFO, message, throwable)
    }

    fun warn(message: String, throwable: Throwable? = null) {
        log(LogLevel.WARN, message, throwable)
    }

    fun error(message: String, throwable: Throwable? = null) {
        log(LogLevel.ERROR, message, throwable)
    }
}